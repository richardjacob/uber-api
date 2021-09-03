import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

import { UserProfile } from '../../models';

// External Types
import ThreadItemType from './ThreadItemType';

const UserProfileType = new ObjectType({
    name: 'UserProfileType',
    fields: {
        picture: { type: StringType },
        firstName: { type: StringType }
    }
});

const UserDetailsType = new ObjectType({
    name: 'UserDetailsType',
    fields: {
        id: { type: StringType },
        email: { type: StringType },
        profile: {
            type: UserProfileType,
            async resolve(result) {
                let userId = result && result.id;
                return await UserProfile.findOne({
                    attributes: ['picture', 'firstName'],
                    where: { userId }
                });
            }
        }
    }
});

const GetAllThreadItemType = new ObjectType({
    name: 'GetAllThreadItemType',
    fields: {
        threadItems: { type: new List(ThreadItemType) },
        userDetails: { type: UserDetailsType },
        currentPage: { type: IntType }
    }
});

export default GetAllThreadItemType;