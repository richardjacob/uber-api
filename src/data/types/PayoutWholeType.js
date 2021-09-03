import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import PayoutType from './PayoutType';

const PayoutWholeType = new ObjectType({
    name: 'PayoutWholeType',
    fields: {
        results: { 
            type: new List(PayoutType),
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
    }
});

export default PayoutWholeType;
