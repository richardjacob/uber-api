import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

import UserType from './UserType';

const UserCommonType = new ObjectType({
    name: 'UserCommon',
    fields: {
        result: {
            type: UserType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default UserCommonType;
