"use strict";
/** Ported from
 * https://github.com/ihm-software/soundplus-jobs-run-scheduled/blob/master/handler.js
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const index_1 = __importDefault(require("axios/index"));
const parameter_store_1 = require("../../util/src/parameter-store");
const secrets_manager_1 = require("../../util/src/secrets-manager");
const loglevel_1 = require("loglevel");
const TokenUtil_1 = require("./TokenUtil");
const runScheduledJob_1 = require("./runScheduledJob");
const getRegion = () => {
    return process.env.AWS_REGION || 'us-east-1';
};
const handler = async () => {
    const log = (0, loglevel_1.getLogger)('start scheduled-job');
    const level = process.env.LOG_LEVEL || loglevel_1.levels.WARN;
    log.setLevel(level);
    const region = getRegion();
    const dynamoDB = new client_dynamodb_1.DynamoDB({ region });
    const ssmClient = new client_ssm_1.SSMClient({ region });
    const smClient = new client_secrets_manager_1.SecretsManagerClient({ region });
    const parameterStoreUtil = (0, parameter_store_1.getParameterStoreUtil)(ssmClient);
    const secretsManagerUtil = (0, secrets_manager_1.getSecretsManagerUtil)(smClient);
    const tokenUtil = (0, TokenUtil_1.getTokenUtil)(parameterStoreUtil, secretsManagerUtil, log, index_1.default);
    await (0, runScheduledJob_1.runScheduledJob)(log, dynamoDB, parameterStoreUtil, secretsManagerUtil, tokenUtil);
};
exports.handler = handler;
//# sourceMappingURL=handler.js.map