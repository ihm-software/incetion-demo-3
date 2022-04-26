"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchJob = void 0;
const winston_1 = require("winston");
const validator_1 = require("./validator");
const mongoDBHelper_1 = require("./mongoDBHelper");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const patchJob = async (orgId, jobKey, jobStatus) => {
    let response = {};
    conn = await connPromise;
    //Validation
    logger.info(`Entering patchJob, OrgID: ${orgId}, JobKey: ${jobKey}, JobStatus: ${jobStatus}`);
    if ((0, validator_1.ValidateGuid)(orgId, response, 'Could not PATCH Job because of validation errors, Invalid OrganizationID Guid')) {
        return response;
    }
    if (!jobKey) {
        const msg = 'Could not PATCH Job because of validation errors, JobKey is required.';
        logger.error(msg);
        response = {
            statusCode: 400,
            body: msg,
        };
        return response;
    }
    if (!jobStatus) {
        const msg = 'Could not PATCH Job because of validation errors, JobStatus is required.';
        logger.error(msg);
        response = {
            statusCode: 400,
            body: msg,
        };
        return response;
    }
    const res = await conn.collection('RaptorJob').findOneAndUpdate({
        JobKey: jobKey,
        OrganizationID: orgId,
    }, {
        $set: {
            JobStatus: jobStatus,
        },
    }, { returnOriginal: false });
    if (res.ok) {
        response = {
            statusCode: 200,
            body: JSON.stringify(res.value),
        };
    }
    else {
        const msg = `Problem during PATCH on Job, OrganizationID: ${orgId}, JobKey ${jobKey}.\r\nResult: ${JSON.stringify(res)}`;
        response = {
            statusCode: 400,
            body: JSON.stringify(msg),
        };
    }
    return response;
};
exports.patchJob = patchJob;
//# sourceMappingURL=patchJob.js.map