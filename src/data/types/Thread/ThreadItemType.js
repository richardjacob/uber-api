import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType
} from 'graphql';

const ThreadItemType = new ObjectType({
  name: 'ThreadItemType',
  fields: {
    id: { type: IntType },
    threadId: { type: StringType },
    isRead: { type: BooleanType },
    authorId: { type: StringType },
    userId: { type: StringType },
    message: { type: StringType },
    createdAt: { type: StringType },
    updatedAt: { type: StringType }
  }
});

export default ThreadItemType;