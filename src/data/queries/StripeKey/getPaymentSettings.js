import { SiteSettings } from '../../models';
import GetPaymentKeyType from '../../types/GetPaymentKeyType';

const getPaymentSettings = {

    type: GetPaymentKeyType,

    async resolve({ request }) {
        try {

            const result = await SiteSettings.findOne({
                attributes: ['id', 'value'],
                where: {
                    name: 'stripePublishableKey'
                }
            });
    
            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : 'Oops! Unable to find. Try again.',
                result:{
                    publishableKey: result.value
                }
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error

            }
        }
    }
};

export default getPaymentSettings;

/*

query {
  getPaymentSettings{
    status
    errorMessage
    result {
      secretKey
      publishableKey
    }
  }
}

*/
