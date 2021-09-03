import {
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType
} from 'graphql';

import { ThreadItems } from '../../models';

import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { getThreadId } from '../../../helpers/Thread/getThreadId';
import { getUsers, getUserDetails } from '../../../helpers/Thread/getUsers';

const getAllThreadItems = {

  type: ThreadItemsCommonType,

  args: {
    bookingId: { type: new NonNull(IntType) },
    currentPage: { type: IntType }
  },

  async resolve({ request }, { bookingId, currentPage }) {
    try {
      if (!request.user || !request.user.id) {
        return {
          status: 500,
          errorMessage: "Oops! Please login with your account and try again."
        };
      }

      let limit = 20, offset = 0;

      if (currentPage) offset = (currentPage - 1) * limit;

      const { riderId, driverId, userId } = await getUsers(bookingId, request.user.id);

      if (!riderId || !driverId || !userId) { //UserId check is added to find, if neither rider nor driver requested.
        return {
          status: 400,
          errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
        };
      }

      const userDetails = await getUserDetails(userId);

      const threadId = await getThreadId(riderId, driverId, bookingId);

      const count = await ThreadItems.count({ where: { threadId } });

      const threadItems = await ThreadItems.findAll({
        where: { threadId },
        offset,
        limit,
        order: [[`createdAt`, `DESC`]],
        raw: true
      });

      return {
        status: 200,
        count,
        result: {
          threadItems,
          userDetails,
          currentPage
        }
      };
    } catch (error) {
      return {
        status: 400,
        errorMessage: 'Something went wrong! ' + error
      };
    }
  }
};

export default getAllThreadItems;

/**
query getAllThreadItems($bookingId: Int!, $currentPage: Int) {
  getAllThreadItems(bookingId: $bookingId, currentPage: $currentPage) {
    status
    errorMessage
    result {
      threadItems {
        id
        threadId
        isRead
        authorId
        userId
        message
        createdAt
        updatedAt
      }
      userDetails {
        id
        email
        profile {
          firstName
          picture
        }
      }
      currentPage
    }
    count
  }
}
 */