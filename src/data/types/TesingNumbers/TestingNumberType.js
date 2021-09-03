import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';

const TestingNumberType = new ObjectType({

    name: 'TestingNumberType',

    fields: {

        id: {
            type: IntType
        },

        dialCode: {
            type: StringType
        },

        phoneNumber: {
            type: StringType
        },

        createdAt: {
            type: StringType
        },

        updatedAt: {
            type: StringType
        }
    }
});

export default TestingNumberType;