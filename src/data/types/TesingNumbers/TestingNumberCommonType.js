import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

// External Types
import TestingNumberType from './TestingNumberType';


const TestingNumberCommonType = new ObjectType({

    name: 'TestingNumberCommonType',

    fields: {

        status: {
            type: IntType
        },

        errorMessage: {
            type: StringType
        },

        result: {
            type: TestingNumberType
        },

        results: {
            type: new List(TestingNumberType)
        }
    }
});

export default TestingNumberCommonType;