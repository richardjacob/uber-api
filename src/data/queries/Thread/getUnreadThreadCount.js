import {
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import { ThreadItems } from '../../models';

import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { getThreadId } from '../../../helpers/Thread/getThreadId';
import { getUsers } from '../../../helpers/Thread/getUsers';

const getUnreadThreadCount = {

    type: ThreadItemsCommonType,

    args: { bookingId: { type: new NonNull(IntType) } },

    async resolve({ request }, { bookingId }) {
        try {
            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: "Oops! Please login with your account and try again."
                };
            }

            const { riderId, driverId, userId } = await getUsers(bookingId, request.user.id);

            if (!riderId || !driverId || !userId) { //UserId check is added to find, if neither rider nor driver requested.
                return {
                    status: 400,
                    errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
                };
            }

            const threadId = await getThreadId(riderId, driverId, bookingId);

            if (!threadId) {
                return {
                    status: 400,
                    errorMessage: "Sorry, no thread found!"
                };
            }

            const count = await ThreadItems.count({
                where: {
                    threadId,
                    isRead: false,
                    userId: request.user.id
                }
            });

            return {
                status: 200,
                count
            };

        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong' + error
            };
        }
    }
};

export default getUnreadThreadCount;

/**
query getUnreadThreadCount($bookingId: Int!) {
  getUnreadThreadCount(bookingId: $bookingId) {
    status
    errorMessage
    count
  }
}
 */