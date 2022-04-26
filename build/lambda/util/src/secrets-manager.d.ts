import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
export declare const getSecretWorker: (smClient: SecretsManagerClient, secredId: string) => Promise<string | undefined>;
export interface SecretsManagerUtil {
    getSecret: (secredId: string) => Promise<string | undefined>;
}
export declare const getSecretsManagerUtil: (smc: SecretsManagerClient) => {
    getSecret: (secredId: string) => Promise<string | undefined>;
};
