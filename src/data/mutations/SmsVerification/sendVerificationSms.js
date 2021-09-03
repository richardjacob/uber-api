import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import { User, SMSVerification, TestingNumber } from '../../models';

import UserAccountType from '../../types/userAccountType';

import { processSms } from '../../../libs/sms/processSms';

const sendVerificationSms = {

    type: UserAccountType,

    args: {
        phoneDialCode: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { phoneDialCode, phoneNumber, deviceId, deviceType }) {
        try {
            let userId, createVerification;
            const isUserExist = await User.findOne({
                attributes: ['id'],
                where: {
                    phoneNumber,
                    phoneDialCode,
                    deletedAt: null
                }
            });

            userId = isUserExist && isUserExist.id;

            let getTestingNumber = await TestingNumber.findOne({
                attributes: ['id'],
                where: {
                    dialCode: phoneDialCode,
                    phoneNumber
                },
                raw: true
            });

            if (phoneDialCode && phoneNumber) {
                let status, errorMessage, verificationCode;
                if (getTestingNumber && getTestingNumber.id) {
                    status = 200; errorMessage = null; verificationCode = 1234;
                } else {
                    let smsResponse = await processSms(phoneDialCode, phoneNumber);
                    status = smsResponse && smsResponse.status;
                    errorMessage = smsResponse && smsResponse.errorMessage;
                    verificationCode = smsResponse && smsResponse.verificationCode;
                }

                if (status == 200 && verificationCode) {
                    let isAlreadyCreated = await SMSVerification.findOne({
                        attributes: ['id'],
                        where: {
                            phoneNumber,
                            phoneDialCode
                        }
                    });

                    if (isAlreadyCreated) {
                        createVerification = await SMSVerification.update({
                            otp: verificationCode,
                            deviceId,
                            deviceType
                        },
                            {
                                where: {
                                    phoneNumber,
                                    phoneDialCode
                                }
                            });
                    } else {
                        createVerification = await SMSVerification.create({
                            phoneNumber,
                            phoneDialCode,
                            userId,
                            deviceId,
                            deviceType,
                            otp: verificationCode
                        })
                    }

                    if (createVerification) {
                        return {
                            status: 200,
                            phoneNumber,
                            phoneDialCode
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: 'Unable to create.',
                        }
                    }

                } else {
                    return {
                        status: 400,
                        errorMessage: errorMessage
                    }
                }
            } else {
                return {
                    status: 400,
                    errorMessage: 'Please enter required information.'
                }
            }

        } catch (error) {
            return {
                errorMessage: 'Something went wrong ' + error,
                status: 400
            };
        }
    }
};

export default sendVerificationSms;

/**
mutation sendVerificationSms($phoneDialCode: String!, $phoneNumber: String!, $deviceId: String!, $deviceType: String!) {
  sendVerificationSms(phoneDialCode: $phoneDialCode, phoneNumber: $phoneNumber, deviceId: $deviceId, deviceType: $deviceType) {
    status
    errorMessage
    phoneNumber
    phoneDialCode
  }
}
 */
