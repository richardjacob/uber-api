import fetch from 'node-fetch';
import { url } from '../../config';

export async function tripStatus(requestData) {
  if (requestData && requestData.data) {
    let query = `query ($userId: String!) {
      tripStatus (
        userId: $userId
      ){
        result {
          id
          riderLocation
          riderLocationLat
          riderLocationLng
          pickUpLocation
          pickUpLat
          pickUpLng
          dropOffLocation
          dropOffLat
          dropOffLng
          riderId
          driverId
          tripStatus
          vehicleType
          totalRideDistance
          baseFare
          baseMinute
          baseUnit
          riderServiceFee
          driverServiceFee
          estimatedTotalFare
          totalFare
          totalDuration
          paymentType
          paymentStatus
          transactionId
          startDate
          startTime
          endDate
          endTime
          tripStart
          tripEnd
          currency
          riderTotalFare
          driverTotalFare
          vehicleId
          vehicleNumber
          isSpecialTrip
          specialTripPrice
          specialTripTotalFare
          isMultipleStops
          multipleStopsCount
          distanceType
          allowedWaitingTime
          riderDetails {
            userId
            userData {
              lat
              lng
              phoneNumber
            }
            firstName
            lastName
            picture
            location
          }
          driverDetails {
            userId
            userData {
              lat
              lng
              phoneNumber
            }
            firstName
            lastName
            picture
            location
          }
          bookingLocations {
            id
            bookingId
            location
            locationLat
            locationLng
            deletedAt
            createdAt
            updatedAt
            locationStatus
            locationDistance
            locationDistanceType
            locationUpdatedAt
            previousLocation
            locationDuration
            locationType
            fieldType
          }
        }
        status
        errorMessage
      }
    }
    `;

    let variables = {
      userId: requestData.data.userId
    };

    const { data, data: { tripStatus } } = await new Promise((resolve, reject) => {
      fetch(url + '/graphql', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables }),
        method: 'post',
      }).then(res => res.json())
        .then(function (body) {
          if (body) {
            resolve(body)
          } else {
            reject(error)
          }
        });
    });

    if (data && tripStatus) {
      return await {
        status: tripStatus.status,
        errorMessage: tripStatus.errorMessage,
        data: tripStatus.result
      };
    } else {
      return await {
        status: 400,
        errorMessage: "Oops! Something went wrong. Please try again!",
        data: null
      };
    }
  } else {
    return {
      status: 400,
      errorMessage: "Oops! Something went wrong. Please check your internet connection and try again!",
      data: null
    }
  }
}