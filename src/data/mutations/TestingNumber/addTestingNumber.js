import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';

import { TestingNumber } from '../../models';

import TestingNumberCommonType from '../../types/TesingNumbers/TestingNumberCommonType';

import { auth } from '../../../config';

const addTestingNumber = {

    type: TestingNumberCommonType,

    args: {
        dialCode: { type: new NonNull(StringType) },
        phoneNumber: { type: NonNull(StringType) },
        secretKey: { type: NonNull(StringType) }
    },

    async resolve({ request }, { dialCode, phoneNumber, secretKey }) {

        try {

            let status = 200, errorMessage = null;
            if (secretKey === auth.jwt.secret) {
                if (phoneNumber && dialCode && /^\+\d+/gi.test(dialCode) && /^[0-9]+$/gi.test(phoneNumber)) {

                    const getTestingNumber = await TestingNumber.findOne({
                        attributes: ['id'],
                        where: { phoneNumber },
                        raw: true
                    });

                    if (!getTestingNumber) {

                        await TestingNumber.create({
                            dialCode,
                            phoneNumber
                        });

                    } else {
                        status = 400;
                        errorMessage = 'Oops! Phone Number is already exist';
                    }
                } else {
                    status = 400;
                    errorMessage = 'Please provide correct format phone number or dial code(eg: +91)';
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

export default addTestingNumber;

/*

mutation($dialCode: String!, $phoneNumber: String!, $secretKey: String!){
    addTestingNumber(dialCode: $dialCode, phoneNumber:$phoneNumber, secretKey:$secretKey){
        status
        errorMessage
    }
}

*/