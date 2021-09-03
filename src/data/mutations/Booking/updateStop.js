import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLBoolean as BooleanType,
} from 'graphql';
import sequelize from '../../sequelize';
import {
	Booking, UserProfile, BookingPromoCode,
	Pricing, BookingLocations, User
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import calculateTripCalculation from '../../../libs/calculateTripCalculation';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';

const updateStop = {

	type: BookingRequestType,

	args: {
		data: { type: StringType },
		distanceType: { type: StringType },
		bookingId: { type: IntType },
		isNotify: { type: BooleanType }
	},

	async resolve({ request }, { data, distanceType, bookingId, isNotify }) {

		try {
			if (request.user) {
				let pickUp, dropOff, rideLength;
				let requestData = JSON.parse(data);
				let riderPayableFare = 0;
				let promoCodeData, isSpecialTrip, specialTripPrice, specialTripTotalFare, totalDuration, calculation, totalDistance;
				// Geo-Fencing
				let pricingAttributes = [
					'id', 'categoryId', 'unitPrice', 'minutePrice', 'basePrice', 'currency', 'riderFeeType',
					'riderFeeValue', 'driverFeeType', 'driverFeeValue', 'isActive', 'isSurgePrice'
				];
				if (requestData.length > 0) {
					rideLength = requestData.length;
					pickUp = requestData[0];
					dropOff = requestData[rideLength - 1];

					let bookingLocationsData = [], existingData = [];

					requestData.map(async (item, index) => {
						if (item.id) {
							existingData.push(item.id);

							const getPreviousLocation = await BookingLocations.findOne(
								{
									attributes: ['id', 'location', 'locationLat', 'locationLng'],
									where: {
										id: item.id,
									},
									raw: true
								});


							let previousLocation;

							if (getPreviousLocation) {
								previousLocation = `location: ${getPreviousLocation.location}, lat: ${getPreviousLocation.locationLat}, lng: ${getPreviousLocation.lng} `;
							}

							const updateBookingLocations = await BookingLocations.update({
								location: item.location,
								locationLat: item.locationLat,
								locationLng: item.locationLng,
								locationDistance: item.locationDistance,
								locationDistanceType: distanceType,
								locationDuration: item.locationDuration,
								locationUpdatedAt: new Date(),
								previousLocation,
								locationType: index === 0 ? 'pickup' : ((index === rideLength - 1) ? 'drop' : 'stop')
							},
								{
									where: {
										id: item.id
									}
								});
						} else {
							bookingLocationsData.push({
								bookingId,
								location: item.location,
								locationLat: item.locationLat,
								locationLng: item.locationLng,
								locationStatus: 'pending',
								locationDistance: item.locationDistance,
								locationDistanceType: distanceType,
								locationDuration: item.locationDuration,
								locationUpdatedAt: new Date(),
								locationType: index === 0 ? 'pickup' : ((index === rideLength - 1) ? 'drop' : 'stop')
							});
						}
					});

					const removeBookingLocations = await BookingLocations.update({
						deletedAt: new Date()
					}, {
						where: {
							bookingId,
							id: {
								$notIn: [...existingData]
							}
						}
					});

					await BookingLocations.bulkCreate(bookingLocationsData);


					const bookingData = await Booking.findOne({
						attributes: [
							'riderId', 'driverId', 'tripStatus', 'isSpecialTrip', 'promoCodeId',
							'tripStart', 'vehicleType', 'paymentType', 'pickUpLocation', 'estimatedTotalFare', 'currency',
							'pricingId', 'multipleStopsCount', 'vehicleNumber', 'vehicleId', 'riderLocationLat', 'riderLocationLng', 'riderLocation'
						],
						where: {
							id: bookingId
						},
						raw: true
					});

					// Rider Data
					const profileData = await UserProfile.findOne({
						attributes: ['userId', 'preferredCurrency', 'preferredLanguage', 'firstName', 'lastName', 'picture', 'paymentCustomerId', 'walletBalance', 'walletUsed', 'paymentMethodId'],
						where: {
							userId: bookingData.riderId
						},
						include: [{
							attributes: ['phoneDialCode', 'phoneNumber', 'overallRating'],
							model: User,
							as: 'user',
							required: true,
							where: {
								id: bookingData.riderId // Rider ID
							},
						}],
						raw: true
					});

					let convertCurrency = profileData && profileData.preferredCurrency;
					// Promo code calculation for trip complete
					if (bookingData && bookingData.isSpecialTrip && bookingData.promoCodeId) {
						promoCodeData = await BookingPromoCode.findOne({
							where: {
								bookingId
							},
							raw: true
						});
					}

					// Find the pricing for the trip which is already assigned
					const pricingInfo = await Pricing.findOne({
						attributes: pricingAttributes,
						where: {
							isActive: true,
							id: bookingData.pricingId
						},
						order: [['updatedAt', 'DESC']],
						raw: true
					});

					const { baseCurrency, rates } = await getCurrencyRates();

					let bookingDistance = await BookingLocations.findAll({
						attributes: ['bookingId', [sequelize.fn('sum', sequelize.col('locationDistance')), 'totalDistance'], [sequelize.fn('sum', sequelize.col('locationDuration')), 'totalDuration']],
						where: {
							bookingId,
							deletedAt: null
						},
						group: ['BookingLocations.bookingId'],
						raw: true,
					});

					totalDistance = bookingDistance[0].totalDistance;
					totalDuration = bookingDistance[0].totalDuration;
					calculation = await calculateTripCalculation(pricingInfo, null, totalDistance, totalDuration, convertCurrency, promoCodeData, rates, baseCurrency);

					// Promo code
					isSpecialTrip = calculation.isSpecialTrip;
					specialTripPrice = calculation.specialTripPrice;
					specialTripTotalFare = calculation.specialTripTotalFare;
					riderPayableFare = calculation.riderPayableFare;
					let riderTotalFare = calculation.totalFareForRider;
					let driverTotalFare = calculation.totalFareForDriver;

					const driverProfileData = await UserProfile.findOne({
						attributes: ['preferredLanguage'],
						where: {
							userId: bookingData.driverId
						},
						raw: true
					});


					if (isNotify) {
						let requestLang = driverProfileData && driverProfileData.preferredLanguage;

						let pushNotificationContent = {
							tripStatus: 'updateStop',
							name: profileData.firstName + ' ' + profileData.lastName,
							userId: bookingData.driverId,
							riderId: bookingData.riderId,
							picture: profileData.picture,
							phoneNumber: profileData['user.phoneDialCode'] + '' + profileData['user.phoneNumber'],
							riderLocation: bookingData.riderLocation,
							riderLocationLat: bookingData.riderLocationLat,
							riderLocationLng: bookingData.riderLocationLng,
							pickUpLocation: pickUp.location,
							pickUpLat: pickUp.locationLat,
							pickUpLng: pickUp.locationLng,
							dropOffLocation: dropOff.location,
							dropOffLat: dropOff.locationLat,
							dropOffLng: dropOff.locationLng,
							bookingId,
							overallRating: profileData['user.overallRating'],
							vehicleId: bookingData.vehicleId,
							vehicleNumber: bookingData.vehicleNumber,
							category: bookingData.vehicleType,
							promoCodeId: promoCodeData && promoCodeData.id,
							isSpecialTrip,
							specialTripPrice,
							specialTripTotalFare,
							riderPayableFare,
							scheduleId: null,
							bookingType: 1,
						};
						sendNotifications('updateStop', pushNotificationContent, bookingData.driverId, requestLang);
					}

					const updateTrip = await Booking.update({
						dropOffLocation: dropOff.location,
						dropOffLat: dropOff.locationLat,
						dropOffLng: dropOff.locationLng,
						distanceType,
						isMultipleStops: rideLength > 2 ? 1 : 0,
						multipleStopsCount: rideLength - 2,
						totalRideDistance: totalDistance,
						baseFare: calculation.basePrice, // Min base fare
						baseUnit: calculation.unitPrice, // Price per unit
						baseMinute: calculation.minutePrice,
						riderServiceFee: calculation.riderServiceFee,
						driverServiceFee: calculation.driverServiceFee,
						totalFare: calculation.totalFare, // with rider service fee
						totalDuration,
						currency: convertCurrency,
						riderTotalFare,
						driverTotalFare,
						isSpecialTrip,
						specialTripPrice,
						specialTripTotalFare,
						riderPayableFare
					}, {
						where: {
							id: bookingId,
						}
					});

					return {
						status: 200
					};

				} else {
					return {
						errorMessage: 'Something went wrong!, No data found',
						status: 400
					};
				}
			} else {
				return {
					status: 500,
					errorMessage: 'You are not LoggedIn'
				}
			}
		} catch (error) {
			return {
				errorMessage: 'Something went wrong!' + error,
				status: 400
			};
		}
	}
};

export default updateStop;