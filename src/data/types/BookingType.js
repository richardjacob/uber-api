import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
	GraphQLBoolean as BooleanType,
	GraphQLList as List
} from 'graphql';

import {
	UserProfile,
	Category,
	ScheduleBooking,
	Reviews,
	BookingLocations
} from '../models';

import ProfileType from './ProfileType';
import GetCategoryType from './GetCategoryType';
import BookingLocationType from './BookingLocationType';
import ScheduleBookingType from './scheduleBooking/ScheduleBookingType';
import { resolve } from 'bluebird';

const BookingType = new ObjectType({
	name: 'BookingType',
	fields: {
		id: {
			type: IntType
		},
		riderLocation: {
			type: StringType
		},
		riderLocationLat: {
			type: FloatType
		},
		riderLocationLng: {
			type: FloatType
		},
		pickUpLocation: {
			type: StringType
		},
		pickUpLat: {
			type: FloatType
		},
		pickUpLng: {
			type: FloatType
		},
		dropOffLocation: {
			type: StringType
		},
		dropOffLat: {
			type: FloatType
		},
		dropOffLng: {
			type: FloatType
		},
		riderId: {
			type: StringType
		},
		driverId: {
			type: StringType
		},
		tripStatus: {
			type: StringType
		},
		vehicleType: {
			type: StringType
		},
		totalRideDistance: {
			type: FloatType
		},
		baseFare: {
			type: FloatType
		},
		baseUnit: {
			type: FloatType
		},
		baseMinute: {
			type: FloatType
		},
		riderServiceFee: {
			type: FloatType
		},
		driverServiceFee: {
			type: FloatType
		},
		estimatedTotalFare: {
			type: FloatType
		},
		totalFare: {
			type: FloatType
		},
		totalDuration: {
			type: FloatType
		},
		paymentType: {
			type: IntType
		},
		paymentStatus: {
			type: StringType
		},
		transactionId: {
			type: StringType
		},
		startDate: {
			type: StringType
		},
		startTime: {
			type: StringType
		},
		endDate: {
			type: StringType
		},
		endTime: {
			type: StringType
		},
		tripStart: {
			type: StringType
		},
		tripEnd: {
			type: StringType
		},
		currency: {
			type: StringType
		},
		riderTotalFare: {
			type: FloatType
		},
		driverTotalFare: {
			type: FloatType
		},
		createdAt: {
			type: StringType
		},
		updatedAt: {
			type: StringType
		},
		notes: {
			type: StringType
		},
		vehicleId: {
			type: IntType
		},
		vehicleNumber: {
			type: StringType
		},
		promoCodeId: {
			type: IntType
		},
		isSpecialTrip: {
			type: BooleanType
		},
		specialTripPrice: {
			type: FloatType
		},
		specialTripTotalFare: {
			type: FloatType
		},
		isTipGiven: {
			type: BooleanType
		},
		tipsAmount: {
			type: FloatType
		},
		tipsTotalFare: {
			type: FloatType
		},
		tipsDriverTotalFare: {
			type: FloatType
		},
		tollFee: {
			type: FloatType
		},
		driverDetails: {
			type: ProfileType,
			resolve(booking) {
				return UserProfile.findOne({
					where: { userId: booking.driverId },
				});
			},
		},
		riderDetails: {
			type: ProfileType,
			async resolve(booking) {
				return await UserProfile.findOne({
					where: { userId: booking.riderId },
				});
			},
		},
		categoryDetails: {
			type: GetCategoryType,
			async resolve(booking) {
				return await Category.findOne({
					where: { id: booking.vehicleType },
				});
			},
		},
		riderPayableFare: {
			type: FloatType
		},
		bookingType: {
			type: IntType
		},
		isMultipleStops: {
			type: BooleanType
		},
		multipleStopsCount: {
			type: IntType
		},
		distanceType: {
			type: StringType
		},
		allowedWaitingTime: {
			type: IntType
		},
		scheduleBookingDetails: {
			type: ScheduleBookingType,
			async resolve(booking) {
				if (booking && booking.bookingType === 2) { // Schedule Booking
					return await ScheduleBooking.findOne({
						attributes: ['id', 'bookingId', 'tripStatus', 'scheduleFrom', 'scheduleTo'],
						where: {
							bookingId: booking.id
						}
					});
				};

				return null
			}
		},
		isRiderReviewed: {
			type: BooleanType,
			async resolve(booking) {
				return await Reviews.count({
					where: {
						bookingId: booking.id,
						authorId: booking.riderId
					}
				}) || false;
			}
		},
		isDriverReviewed: {
			type: BooleanType,
			async resolve(booking) {
				return await Reviews.count({
					where: {
						bookingId: booking.id,
						authorId: booking.driverId
					}
				}) || false;
			}
		},
		bookingLocations: {
			type: new List(BookingLocationType),
			async resolve(booking) {
				return await BookingLocations.findAll({
					where: {
						bookingId: booking.id,
						deletedAt: null
					},
					order: [['id', 'ASC']],
				});
			},
		},
	}
});

export default BookingType;