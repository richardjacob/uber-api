import {
	GraphQLFloat as FloatType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLString as StringType
} from 'graphql';
import {
	BookingLocations,
	Booking,
	UserProfile,
	User,
	SiteSettings
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';

const confirmStop = {

	type: BookingRequestType,

	args: {
		bookingId: { type: new NonNull(IntType) },
		locationDistance: { type: new NonNull(FloatType) },
		locationDuration: { type: new NonNull(FloatType) },
		location: { type: new NonNull(StringType) },
		locationLat: { type: new NonNull(FloatType) },
		locationLng: { type: new NonNull(FloatType) },
		id: { type: new NonNull(IntType) },
	},

	async resolve({ request }, { bookingId, locationDistance, locationDuration, location, locationLat, locationLng, id }) {

		try {

			let pushNotificationContent, requestLang;
			// Booking Data
			const bookingData = await Booking.findOne({
				attributes: [
					'id', 'tripStatus', 'riderId', 'driverId', 'vehicleId', 'vehicleNumber'
				],
				where: {
					id: bookingId
				},
				raw: true
			});

			if (bookingData) {

				if (bookingData.tripStatus === 'started') {
					const bookingLocationUpdate = await BookingLocations.update({
						location,
						locationLat,
						locationLng,
						locationDistance,
						locationStatus: 'completed',
						locationDuration,
						locationReachedAt: new Date(),
					}, {
						where: {
							id
						}
					});

					const bookingLocations = await BookingLocations.findOne({
						where: {
							id: {
								$gt: id
							},
							deletedAt: null,
							bookingId
						},
						raw: true,
						order: [
							[`id`, `ASC`],
						]
					});

					const riderProfileData = await UserProfile.findOne({
						attributes: ['preferredLanguage', 'firstName', 'lastName'],
						where: {
							userId: bookingData.riderId
						},
						raw: true
					});

					const driverProfileData = await User.findOne({
						where: {
							id: bookingData.driverId
						},
						include: [
							{
								model: UserProfile,
								as: 'profile',
								required: true,
								where: {
									userId: bookingData.driverId
								},
							}
						],
						raw: true
					});

					const waitingTime = await SiteSettings.findOne({
						attributes: ['id', 'value'],
						where: {
							name: 'multipleStopsWaitingTime'
						}
					});

					requestLang = riderProfileData && riderProfileData.preferredLanguage;

					// Push Notification to Rider
					pushNotificationContent = {
						riderName: riderProfileData.firstName,
						stopLocation: location,
						waitingTime: waitingTime.value,
						tripStatus: 'confirmStop',
						driverId: bookingData.driverId,
						driverName: driverProfileData['profile.firstName'] + ' ' + driverProfileData['profile.lastName'],
						picture: driverProfileData['profile.picture'],
						driverLat: driverProfileData.lat,
						driverLng: driverProfileData.lng,
						phoneNumber: driverProfileData.phoneDialCode + '' + driverProfileData.phoneNumber,
						bookingId,
						overallRating: driverProfileData.overallRating,
						vehicleId: bookingData.vehicleId,
						vehicleNumber: bookingData.vehicleNumber
					};


					sendNotifications('confirmStop', pushNotificationContent, bookingData.riderId, requestLang);

					if (bookingLocations) {
						return await {
							status: 200,
							locationData: {
								id: bookingLocations.id,
								bookingId: bookingLocations.bookingId,
								location: bookingLocations.location,
								locationLat: bookingLocations.locationLat,
								locationLng: bookingLocations.locationLng,
								locationDistance: bookingLocations.locationDistance,
								locationDistanceType: bookingLocations.locationDistanceType,
								locationDuration: bookingLocations.locationDuration,
								locationType: bookingLocations.locationType,
								riderId: bookingData.riderId,
								driverId: bookingData.driverId
							}
						};
					} else {
						return await {
							status: 400,
							errorMessage: 'No Stop found!'
						};
					}
				} else {
					return await {
						status: 400,
						errorMessage: 'Oops! it looks like you have already completed this ride. Please close your application and try again.',
						data: {
							tripStatus: bookingData.tripStatus
						}
					};
				}
			} else {
				return {
					errorMessage: 'Oops! something went wrong. Please try again.',
					status: 400
				};
			}
		} catch (error) {
			return {
				errorMessage: 'Something went wrong' + error,
				status: 400
			};
		}
	}
};

export default confirmStop;

