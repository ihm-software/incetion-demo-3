import { Axios } from 'axios';
import Logger from 'loglevel';
import { ParameterStoreUtil } from '../../util/src/parameter-store';
import { SecretsManagerUtil } from '../../util/src/secrets-manager';
export interface TokenUtil {
    getAuthToken: () => Promise<null | string>;
}
/**  Get authentication token from iotcore API
 * @param log: Logger.Logger
 * @returns Promise<string>
 */
export declare const getTokenUtil: (parameterStoreUtil: ParameterStoreUtil, secretsManagerUtil: SecretsManagerUtil, log: Logger.Logger, axios: Axios) => {
    getAuthToken: () => Promise<null | string>;
};
