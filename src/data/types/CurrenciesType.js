import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql'; 

const CurrenciesType = new ObjectType({
    name : "Currencies",
    fields: {
        id: {
            type: IntType
        },
        symbol: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
        isBaseCurrency: {
            type: BooleanType
        },
        isPayment: {
            type: BooleanType
        }
    }
});

export default CurrenciesType;