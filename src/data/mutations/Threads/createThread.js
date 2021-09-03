import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import { Threads, ThreadItems } from '../../models';

import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { sendSocketNotification } from '../../../helpers/sendSocketNotification'
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { getUsers, getUserLang } from '../../../helpers/Thread/getUsers';

const createThread = {

    type: ThreadItemsCommonType,

    args: {
        bookingId: { type: new NonNull(IntType) },
        message: { type: new NonNull(StringType) }
    },

    async resolve({ request }, { bookingId, message }) {
        try {
            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: "Oops! Please login with your account and try again."
                };
            }

            const { riderId, driverId, userId } = await getUsers(bookingId, request.user.id);

            if (!riderId || !driverId || !userId) {
                return {
                    status: 400,
                    errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
                };
            }

            const thread = await Threads.findOrCreate({
                where: {
                    bookingId,
                    riderId,
                    driverId
                },
                defaults: {
                    bookingId,
                    riderId,
                    driverId
                },
                raw: true
            });

            let threadId = thread && thread[0] && thread[0].id;

            let threadItems = await ThreadItems.create({
                threadId,
                authorId: request.user.id,
                userId,
                message
            });

            const unReadRiderCount = await ThreadItems.count({
                where: {
                    threadId,
                    userId: riderId,
                    isRead: false
                }
            });

            const unReadDriverCount = await ThreadItems.count({
                where: {
                    threadId,
                    userId: driverId,
                    isRead: false
                }
            });

            if (!threadItems || !threadItems.id) {
                return {
                    status: 400,
                    errorMessage: 'Oops! Unable to send a message and please try again.'
                };
            }

            threadItems = threadItems.dataValues;
            threadItems['unReadRiderCount'] = unReadRiderCount;
            threadItems['unReadDriverCount'] = unReadDriverCount;
            const preferredLanguage = await getUserLang(userId);

            sendSocketNotification('newMessage-' + bookingId, threadItems);
            sendNotifications('newMessage', threadItems, userId, preferredLanguage);

            return { status: 200 };

        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Something went wrong' + error
            };
        }
    }
};

export default createThread;

/**
mutation createThread($bookingId: Int!, $message: String!) {
  createThread(bookingId: $bookingId, message: $message) {
    status
    errorMessage
  }
}
 */