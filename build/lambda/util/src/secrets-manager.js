"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretsManagerUtil = exports.getSecretWorker = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const getSecretWorker = async (smClient, secredId) => {
    const result = await smClient.send(new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secredId }));
    return result === null || result === void 0 ? void 0 : result.SecretString;
};
exports.getSecretWorker = getSecretWorker;
const getSecretsManagerUtil = (smc) => {
    return {
        getSecret: async (secredId) => {
            return (0, exports.getSecretWorker)(smc, secredId);
        },
    };
};
exports.getSecretsManagerUtil = getSecretsManagerUtil;
//# sourceMappingURL=secrets-manager.js.map