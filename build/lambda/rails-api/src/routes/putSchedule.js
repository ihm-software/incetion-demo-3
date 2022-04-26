"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putSchedule = void 0;
const winston_1 = require("winston");
const mongoDBHelper_1 = require("../util/mongoDBHelper");
const validator_1 = require("../util/validator");
const common_1 = require("../util/common");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const putSchedule = async (req, res) => {
    const { pathParameters, body } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid'))
            return response;
        //Validataion
        const scheduleKey = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey;
        logger.info(`GET Job: ${scheduleKey}`);
        if (scheduleKey === null) {
            const msg = 'Could not GET Job Schedule because of validation errors, valid schedulekey is required.';
            logger.error(msg);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        let requestBody;
        if (body !== null && body !== undefined) {
            requestBody = body;
        }
        //TODO: Verify request body matches a valid job schema check
        //VERIFY: Job - Verify Path Parameter matchs, body ScheduleKey
        if (requestBody.ScheduleKey !== scheduleKey) {
            const msg = 'Could not PUT jobschedule because of validation errors, body ScheduleKey does not match path parameter schedulekey';
            logger.error(msg);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        //VERFIY: if the OrgId is passed in the body, it must match the pathParameter..
        if (requestBody.OrganizationID) {
            if (requestBody.OrganizationID !== z_cloud_org_id) {
                const msg = 'Could not PUT jobschedule because of validation errors, body OrganizationID does not match active OrganizationID';
                logger.error(msg);
                response = {
                    statusCode: 400,
                    body: msg,
                };
                res.send(response);
                return;
            }
        }
        else {
            //Did not pass in the OrganizationID, set it from the path parameter
            requestBody.OrganizationID = z_cloud_org_id;
        }
        const errors = await (0, validator_1.validateJSON)('RaptorJobSchedule', requestBody, ['OrganizationID', 'ScheduleKey']);
        if (errors === '') {
            logger.info('Incoming JSON successfully validated against the schema.');
        }
        else {
            const msg = 'Incoming JSON failed to validate against the schema: ' + errors;
            logger.error(msg);
            logger.error(requestBody); //log the schema being passed in
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        logger.info(`PUT JobSchedule, OrgID: ${requestBody.OrganizationID}, ScheduleKey: ${requestBody.ScheduleKey}`);
        conn = await connPromise;
        const raptorObj = (0, common_1.prepareRaptorJobScheduleObject)(requestBody); //Set Modified time and remove undefines..
        const upserted = await conn.collection('RaptorJobSchedule').findOneAndReplace({
            OrganizationID: raptorObj.OrganizationID,
            ScheduleKey: raptorObj.ScheduleKey,
        }, raptorObj, {
            upsert: true,
            returnOriginal: false,
        });
        if (upserted.ok) {
            //only return the created time if the record was upserted
            if (upserted.value && upserted.lastErrorObject && !upserted.lastErrorObject.updatedExisting && upserted.value._id) {
                raptorObj.CreatedDateTime = upserted.value._id.getTimestamp();
            }
            response = {
                statusCode: 200,
                body: JSON.stringify(raptorObj),
            };
        }
        else {
            const msg = `Could not PUT JobSchedule during database operation, ScheduleKey ${raptorObj.ScheduleKey}`;
            logger.error(msg);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
    }
    catch (e) {
        const msg = `Unable to CREATE JobSchedule: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.putSchedule = putSchedule;
//# sourceMappingURL=putSchedule.js.map