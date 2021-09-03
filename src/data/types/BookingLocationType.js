import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLFloat as FloatType

} from 'graphql';

import {
  BookingLocations
} from '../models';

const BookingLocationType = new ObjectType({
  name: 'BookingLocationType',
  fields: {
    id: {
      type: IntType
    },
    bookingId: {
      type: IntType
    },
    location: {
      type: StringType
    },
    locationLat: {
      type: FloatType
    },
    locationLng: {
      type: FloatType
    },
    deletedAt: {
      type: StringType
    },
    locationStatus: {
      type: StringType
    },
    locationDistance: {
      type: FloatType
    },
    locationDistanceType: {
      type: StringType
    },
    locationUpdatedAt: {
      type: StringType
    },
    locationReachedAt: {
      type: StringType
    },
    previousLocation: {
      type: StringType
    },
    locationDuration: {
      type: FloatType
    },
    locationType: {
      type: StringType
    },
    createdAt: {
      type: StringType
    },
    updatedAt: {
      type: StringType
    },
    riderId: {
      type: StringType
    },
    driverId: {
      type: StringType
    },
    fieldType: {
      type: StringType,
      async resolve(data) {
        const bookings = await BookingLocations.findOne({
          attributes: ['id', 'bookingId', 'locationStatus'],
          where: {
            bookingId: data.bookingId,
            deletedAt: null,
            id: {
              $lt: data.id
            },
          },
          raw: true,
          order: [
            [`id`, `DESC`],
          ]
        });
        if (bookings && bookings.locationStatus) {
          if (bookings.locationStatus === 'pending' && data.locationStatus === 'pending') {
            return 'deletable'
          } else if (bookings.locationStatus === 'pending' && data.locationStatus === 'completed') {
            return 'disabled'
          } else if (bookings.locationStatus === 'completed' && data.locationStatus === 'pending') {
            return 'editable'
          } else if (bookings.locationStatus === 'completed' && data.locationStatus === 'completed') {
            return 'disabled'
          }
        } else if (data.locationStatus === 'completed') {
          return 'disabled';
        } else {
          return 'disabled';
        }
      }
    },
  }
});

export default BookingLocationType;
