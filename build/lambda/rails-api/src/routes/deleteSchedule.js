"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = void 0;
const winston_1 = require("winston");
const mongoDBHelper_1 = require("../util/mongoDBHelper");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const deleteSchedule = async (req, res) => {
    const { pathParameters } = req;
    let response;
    try {
        conn = await connPromise;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Could not DELETE Job because of validation errors, Invalid OrganizationID Guid'))
            return response;
        const scheduleKey = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey;
        if (!scheduleKey) {
            const msg = 'Could not DELETE JobSchedule because of validation errors, ScheduleKey is required.';
            logger.error(msg);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        const ret = await conn.collection('RaptorJobSchedule').findOneAndDelete({
            OrganizationID: z_cloud_org_id,
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
            const msg = `Could not DELETE Job because OrgID: ${z_cloud_org_id}, ScheduleKey: ${scheduleKey} was not found`;
            response = {
                statusCode: 404,
                body: msg,
            };
            res.send(response);
            return;
        }
    }
    catch (e) {
        const msg = `Unable to DELETE Job: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.deleteSchedule = deleteSchedule;
//# sourceMappingURL=deleteSchedule.js.map