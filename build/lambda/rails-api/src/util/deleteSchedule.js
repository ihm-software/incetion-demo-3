"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = void 0;
const winston_1 = require("winston");
const validator_1 = require("./validator");
const mongoDBHelper_1 = require("./mongoDBHelper");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const deleteSchedule = async (orgId, scheduleKey) => {
    let response;
    conn = await connPromise;
    //Validation
    logger.info(`Entering deleteJobAsync, OrgID: ${orgId}, JobKey: ${scheduleKey}`);
    if ((0, validator_1.ValidateGuid)(orgId, response, 'Could not DELETE Job because of validation errors, Invalid OrganizationID Guid')) {
        return response;
    }
    if (!scheduleKey) {
        const msg = 'Could not DELETE Job Schedule because of validation errors, JobKey is required.';
        logger.error(msg);
        response = {
            statusCode: 400,
            body: msg,
        };
        return response;
    }
    const ret = await conn.collection('RaptorJobSchedule').findOneAndDelete({
        OrganizationID: orgId,
        ScheduleKey: scheduleKey,
    });
    if (ret.value !== null) {
        ret.value.CreatedDateTime = ret.value._id.getTimestamp();
        delete ret.value._id;
        response = {
            statusCode: 200,
            body: JSON.stringify(ret.value),
        };
    }
    else {
        const msg = `Could not DELETE Job Schedule because OrgID: ${orgId}, JobKey: ${scheduleKey} was not found`;
        response = {
            statusCode: 404,
            body: msg,
        };
    }
    return response;
};
exports.deleteSchedule = deleteSchedule;
//# sourceMappingURL=deleteSchedule.js.map