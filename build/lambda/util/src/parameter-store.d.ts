import { SSMClient } from '@aws-sdk/client-ssm';
export interface ParameterStoreUtil {
    getParameter: (name: string) => Promise<string | undefined>;
    getEncryptedParameter: (name: string) => Promise<string | Error>;
}
export declare const getParameterStoreUtil: (ssm: SSMClient) => {
    getParameter: (path: string) => Promise<string | undefined>;
    getEncryptedParameter: (path: string) => Promise<string | Error>;
};
