import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

import UserAccountType from './userAccountType';

const VerifyPhoneNumberType = new ObjectType({
    name: 'VerifyPhoneNumber',
    fields: {
        result: {
            type: UserAccountType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default VerifyPhoneNumberType;
