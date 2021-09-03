import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';

import { TestingNumber } from '../../models';

import TestingNumberCommonType from '../../types/TesingNumbers/TestingNumberCommonType';

import { auth } from '../../../config';

const getAllTestingNumbers = {

    type: TestingNumberCommonType,

    args: {
        secretKey: { type: NonNull(StringType) }
    },

    async resolve({ request }, { secretKey }) {

        try {

            let status = 200, errorMessage = null, results;
            if (secretKey === auth.jwt.secret) {

                results = await TestingNumber.findAll({});

            } else {
                status = 500;
                errorMessage = 'Authentication Error';
            }

            return {
                status,
                errorMessage,
                results
            };

        } catch (error) {
            return {
                status: 400,
                error: `Oops! Something happened ${error}`
            };
        }
    }
};

export default getAllTestingNumbers;

/*

query($secretKey: String!){
    getAllTestingNumbers(secretKey:$secretKey){
        status
        errorMessage
        results {
            id
            dialCode
            phoneNumber
            createdAt
            updatedAt
        }
    }
}

*/