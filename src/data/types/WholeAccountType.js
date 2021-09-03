import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
  } from 'graphql';

import UserAccountType from './userAccountType';

  const WholeAccountType = new ObjectType({
    name: 'WholeAccount',
    fields: {
      result: {
        type: UserAccountType
      },
      status: { type: IntType },
      errorMessage: { type: StringType }
    },
  });

  export default WholeAccountType;
