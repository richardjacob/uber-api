import fetch from 'node-fetch';
import { url } from '../../config';

export async function confirmStop(requestData) {
  if (requestData && requestData.data) {
    let query = `mutation($bookingId: Int!, $locationDistance: Float!,$locationDuration: Float!, $location: String!, $locationLat: Float!, $locationLng: Float!, $id: Int!) {
      confirmStop(bookingId: $bookingId, locationDistance: $locationDistance,locationDuration: $locationDuration, location: $location, locationLat: $locationLat, locationLng: $locationLng, id: $id) {
          status
          errorMessage
          locationData {
              id
              bookingId
              riderId
              driverId
              location
              locationLat
              locationLng
              locationDistance
              locationDistanceType
              locationDuration
              locationType
          }
        }
      }`;


    let variables = {
      bookingId: requestData.data.bookingId,
      locationDistance: requestData.data.locationDistance,
      locationDuration: requestData.data.locationDuration,
      location: requestData.data.location,
      locationLat: requestData.data.locationLat,
      locationLng: requestData.data.locationLng,
      id: requestData.data.id
    };


    const { data, data: { confirmStop } } = await new Promise((resolve, reject) => {
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

    if (data && confirmStop) {
      return await {
        status: confirmStop.status,
        errorMessage: confirmStop.errorMessage,
        data: confirmStop.locationData
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