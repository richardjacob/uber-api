import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
  } from 'graphql';
  import EmailTokenType from './EmailTokenType';

  const getEmailToken = new ObjectType({
    name: 'AllEmailToken',
    fields: {

        results: {
            type: EmailTokenType 
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        }
    },
  });
  
  export default getEmailToken;