import {
    GraphQLString as StringType,
} from 'graphql';
import { Booking, User } from '../../models';
import GetTripStatusType from '../../types/GetTripStatusType';

const tripStatus = {

    type: GetTripStatusType,
    args: {
        userId: { type: StringType },
    },
    async resolve({ request }, { userId }) {
        try {
            if (userId) {
                let UserBookingDetails;
                let userIdFilter = {}, statusFilter = {};

                let userData = await User.findOne({
                    attributes: ['userType'],
                    where: {
                        id: userId,
                        deletedAt: null
                    },
                    raw: true
                });

                if (userData && userData.userType === 1) { // Rider
                    userIdFilter = {
                        riderId: userId
                    };
                } else if (userData && userData.userType === 2) { // Driver
                    userIdFilter = {
                        driverId: userId
                    };
                }

                statusFilter = {
                    tripStatus: {
                        $notIn: ['scheduled']
                    }
                };

                UserBookingDetails = await Booking.findOne({
                    where: {
                        $and: [
                            userIdFilter,
                            statusFilter
                        ]
                    },
                    order: [[`id`, `DESC`]],
                    raw: true
                });

                if (UserBookingDetails) {
                    return await {
                        result: UserBookingDetails,
                        status: 200
                    }
                } else {
                    return await {
                        status: 400,
                        errorMessage: 'Sorry, no trips found!'
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'You are not LoggedIn'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }

    },
};

export default tripStatus;
