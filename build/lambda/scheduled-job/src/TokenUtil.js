"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenUtil = void 0;
/**  Get authentication token from iotcore API
 * @param log: Logger.Logger
 * @returns Promise<string>
 */
const getTokenUtil = (parameterStoreUtil, secretsManagerUtil, log, axios) => {
    return {
        getAuthToken: async ( /*orgID: string,*/) => {
            const urlParam = '/soundplus/iotcore/api/url';
            const iotApiUrl = await parameterStoreUtil.getEncryptedParameter(urlParam);
            if (!iotApiUrl) {
                log.error(` Failed to load ${urlParam} from AWS Parameter Store`);
                return null;
            }
            const urlKeySecret = '/soundplus/iotcore/api/key';
            const iotApiKey = await secretsManagerUtil.getSecret(urlKeySecret);
            if (!iotApiKey) {
                log.error(` Failed to load ${urlKeySecret} from AWS Secrets Manager`);
                return null;
            }
            const iotcoreURL = `${iotApiUrl}/iot/createIoTToken`;
            const response = await axios.post(iotcoreURL, null, {
                headers: {
                    'User-Agent': 'Request-Promise',
                    'X-Api-Key': iotApiKey,
                    /*'z-cloud-org-id': orgID,*/
                },
            });
            return response.headers['x-amzn-token'];
        },
    };
};
exports.getTokenUtil = getTokenUtil;
//# sourceMappingURL=TokenUtil.js.map