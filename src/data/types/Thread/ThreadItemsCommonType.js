import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

// External Types
import ThreadItemType from './ThreadItemType';
import GetAllThreadItemType from './GetAllThreadItemType';

const ThreadItemsCommonType = new ObjectType({
    name: 'ThreadItemsCommonType',
    fields: {
        status: { type: IntType },
        errorMessage: { type: StringType },
        result: { type: GetAllThreadItemType },
        results: { type: new List(ThreadItemType) },
        count: { type: IntType }
    }
});

export default ThreadItemsCommonType;