"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateGuid = exports.validateJSON = void 0;
const ajv_1 = __importDefault(require("ajv"));
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const theSchema = require('../../assets/RaptorComplete.schema.json');
let ajv = null;
let validator = null;
const validateJSON = async (theType, theJSON, requiredFields, allowAdditionalProperties = false) => {
    console.log(theJSON);
    if (!ajv) {
        ajv = new ajv_1.default({
            allErrors: true,
            unknownFormats: ['guid', 'double', 'int64'],
            missingRefs: 'ignore',
        });
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        if (theType === 'RaptorUser')
            theSchema.definitions[theType].properties.profile.required = requiredFields;
        else
            theSchema.definitions[theType].required = requiredFields;
        theSchema.definitions[theType].additionalProperties = allowAdditionalProperties;
        validator = ajv.compile(theSchema);
    }
    const jsn = {
        [theType]: theJSON,
    };
    let errors = '';
    if (!validator(jsn)) {
        errors = JSON.stringify(validator === null || validator === void 0 ? void 0 : validator.errors);
    }
    console.log(errors);
    return errors;
};
exports.validateJSON = validateJSON;
const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function ValidateGuid(stringToCheck, response, errorMsg) {
    if (true !== regexGuid.test(stringToCheck)) {
        const msg = `Validation error, ${errorMsg}.`;
        logger.error(msg);
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: msg,
        });
        return response;
    }
}
exports.ValidateGuid = ValidateGuid;
//# sourceMappingURL=validator.js.map