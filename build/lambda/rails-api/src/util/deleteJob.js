"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = void 0;
const winston_1 = require("winston");
const validator_1 = require("../util/validator");
const mongoDBHelper_1 = require("./mongoDBHelper");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const deleteJob = async (orgId, jobkey) => {
    let response;
    conn = await connPromise;
    //Validation
    logger.info(`Entering deleteJobAsync, OrgID: ${orgId}, JobKey: ${jobkey}`);
    if ((0, validator_1.ValidateGuid)(orgId, response, 'Could not DELETE Job because of validation errors, Invalid OrganizationID Guid')) {
        return response;
    }
    if (!jobkey) {
        const msg = 'Could not DELETE Job because of validation errors, JobKey is required.';
        logger.error(msg);
        response = {
            statusCode: 400,
            body: msg,
        };
        return response;
    }
    const ret = await conn.collection('RaptorJob').findOneAndDelete({ OrganizationID: orgId, JobKey: jobkey });
    if (ret.value !== null) {
        ret.value.CreatedDateTime = ret.value._id.getTimestamp();
        delete ret.value._id;
        response = {
            statusCode: 200,
            body: JSON.stringify(ret.value),
        };
    }
    else {
        const msg = `Could not DELETE Job because OrgID: ${orgId}, JobKey: ${jobkey} was not found`;
        response = {
            statusCode: 404,
            body: msg,
        };
    }
    return response;
};
exports.deleteJob = deleteJob;
//# sourceMappingURL=deleteJob.js.map