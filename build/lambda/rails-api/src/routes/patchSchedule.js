"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchSchedule = void 0;
const winston_1 = require("winston");
const mongoDBHelper_1 = require("../util/mongoDBHelper");
const validator_1 = require("../util/validator");
const common_1 = require("../util/common");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const patchSchedule = async (req, res) => {
    const { body, pathParameters } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid'))
            return response;
        let requestBody;
        if (body !== null && body !== undefined)
            requestBody = body;
        //VERFIY: if the ScheduleKey is passed in the body, it must match the pathParameter..
        if (requestBody.ScheduleKey) {
            if (requestBody.ScheduleKey !== (pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey)) {
                const msg = 'Could not PATCH Job Schedule because of validation errors, body ScheduleKey does not match path parameter id';
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
            //Did not pass in the ScheduleKey, set it from the path parameter
            requestBody.ScheduleKey = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey;
        }
        //VERFIY: if the OrgId is passed in the body, it must match the pathParameter..
        if (requestBody.OrganizationID) {
            if (requestBody.OrganizationID !== z_cloud_org_id) {
                const msg = 'Could not PATCH Job because of validation errors, body OrganizationID does not match active OrganizationID';
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
            //Did not pass in the ScheduleKey, set it from the path parameter
            requestBody.OrganizationID = z_cloud_org_id;
        }
        const errors = await (0, validator_1.validateJSON)('RaptorJobSchedule', requestBody, ['OrganizationID', 'ScheduleKey']);
        if (errors === '') {
            logger.info('Incoming JSON successfully validated against the schema.');
        }
        else {
            logger.error(requestBody);
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
        logger.info(`PATCHING JobSchedule, OrgID: ${requestBody.OrganizationID}, ScheduleKey: ${requestBody.ScheduleKey}`);
        conn = await connPromise;
        const raptorObj = (0, common_1.prepareRaptorJobScheduleObject)(requestBody); //Set Modified time and remove undefines..
        const updateObject = await (0, mongoDBHelper_1.generateUpdateObject)(raptorObj, ['OrganizationID', 'ScheduleKey']);
        logger.info(`Update Object ${JSON.stringify(updateObject.set)} - ${JSON.stringify(updateObject.push)} - ${JSON.stringify(updateObject.unset)}`);
        const find = await conn.collection('RaptorJobSchedule').findOneAndUpdate({
            ScheduleKey: raptorObj.ScheduleKey,
            OrganizationID: raptorObj.OrganizationID,
        }, {
            ...(updateObject.set && {
                $set: updateObject.set,
            }),
            ...(updateObject.unset && {
                $unset: updateObject.unset,
            }),
        }, {
            returnOriginal: false,
        });
        if (find.ok) {
            response = {
                statusCode: 200,
                body: JSON.stringify(raptorObj),
            };
        }
        else {
            const msg = `Problem during PATCH on JobSchedule, OrganizationID: ${raptorObj.OrganizationID}, ScheduleKey ${raptorObj.ScheduleKey}.\r\nResult: ${JSON.stringify(find)}`;
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
    }
    catch (err) {
        const msg = `Unable to PATCH JobSchedule: ${err}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.patchSchedule = patchSchedule;
//# sourceMappingURL=patchSchedule.js.map