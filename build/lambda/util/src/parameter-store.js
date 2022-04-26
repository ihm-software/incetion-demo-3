"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameterStoreUtil = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const getParameterWorker = async (ssmClient, name, decrypt) => {
    var _a;
    const result = await ssmClient.send(new client_ssm_1.GetParameterCommand({ Name: name, WithDecryption: decrypt }));
    return (_a = result === null || result === void 0 ? void 0 : result.Parameter) === null || _a === void 0 ? void 0 : _a.Value;
};
const getParameterStoreUtil = (ssm) => {
    return {
        getParameter: async (path) => {
            return getParameterWorker(ssm, path, false);
        },
        getEncryptedParameter: async (path) => {
            const param = await getParameterWorker(ssm, path, true);
            return param !== null && param !== void 0 ? param : new Error(`Failed to load ${path} from AWS Parameter Store`);
        },
    };
};
exports.getParameterStoreUtil = getParameterStoreUtil;
//# sourceMappingURL=parameter-store.js.map