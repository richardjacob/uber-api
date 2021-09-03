import {
    GraphQLInt as IntType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';

import { TestingNumber } from '../../models';

import TestingNumberCommonType from '../../types/TesingNumbers/TestingNumberCommonType';

import { auth } from '../../../config';

const deleteTestingNumber = {

    type: TestingNumberCommonType,

    args: {
        id: { type: new NonNull(IntType) },
        secretKey: { type: NonNull(StringType) }
    },

    async resolve({ request }, { id, secretKey }) {

        try {

            let status = 200, errorMessage = null;
            if (secretKey === auth.jwt.secret) {

                const getTestingNumber = await TestingNumber.findOne({
                    attributes: ['id'],
                    where: { id },
                    raw: true
                });

                if (getTestingNumber) {

                    await TestingNumber.destroy({ where: { id } });

                } else {
                    status = 400;
                    errorMessage = 'Record Not Found!';
                }
            } else {
                status = 500;
                errorMessage = 'Authentication Error';
            }

            return {
                status,
                errorMessage
            };

        } catch (error) {
            return {
                status: 400,
                error: `Oops! Something happened ${error}`
            };
        }
    }
};

export default deleteTestingNumber;

/*

mutation($id: Int!, $secretKey: String!){
    deleteTestingNumber(id: $id, secretKey:$secretKey){
        status
        errorMessage
    }
}

*/