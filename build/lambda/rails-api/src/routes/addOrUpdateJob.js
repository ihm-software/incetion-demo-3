"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrUpdateJob = void 0;
const winston_1 = require("winston");
const jobUtil_1 = require("../util/jobUtil");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const addOrUpdateJob = async (req, res) => {
    const { context, body } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        let requestBody;
        if (body !== null && body !== undefined)
            requestBody = body;
        //VERFIY: if the OrgId is passed in the body, it must match the pathParameter..
        if (requestBody.OrganizationID) {
            if (requestBody.OrganizationID !== z_cloud_org_id) {
                const msg = 'Could not Create job because of validation errors, body OrganizationID does not match active OrganizationID';
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
        //since we are might be creating an asset we should make sure it has a proper title..
        const errors = await (0, validator_1.validateJSON)('RaptorJob', requestBody, ['OrganizationID', 'JobKey']);
        if (errors === '') {
            logger.info('Incoming JSON successfully validated against the schema.');
        }
        else {
            const msg = `${context.functionName}: Incoming JSON failed to validate against the schema: ` + errors;
            logger.error(msg);
            logger.error(requestBody); //log the schema being passed in
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        logger.info(`AddOrUpdate Job, OrgID: ${requestBody.OrganizationID}. JobKey: ${requestBody.JobKey}`);
        response = await (0, jobUtil_1.AddOrUpdateJobAsync)(requestBody);
    }
    catch (e) {
        const msg = `Unable to AddOrUpdate Job: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
        res.send(response);
    }
    res.send(response);
};
exports.addOrUpdateJob = addOrUpdateJob;
//# sourceMappingURL=addOrUpdateJob.js.map