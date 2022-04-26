"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndRunJob = void 0;
const winston_1 = require("winston");
const jobUtil_1 = require("../util/jobUtil");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const createAndRunJob = async (req, res) => {
    const { body } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid'))
            return response;
        logger.info(req);
        let requestBody;
        if (body !== null && body !== undefined)
            requestBody = body;
        //VERFIY: if the OrgId is passed in the body, it must match the pathParameter
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
        const errors = await (0, validator_1.validateJSON)('RaptorJob', requestBody, ['OrganizationID', 'JobKey']);
        if (errors === '') {
            logger.info('Incoming JSON successfully validated agaist the schema');
        }
        else {
            const msg = 'Incoming JSON failed to validate against the schema: ' + errors;
            logger.error(msg);
            logger.error(requestBody);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        logger.info(`CREATE and RUN Job, OrgID: ${requestBody.OrganizationID}. JobKey: ${requestBody.JobKey}`);
        //Create the job and Set the job in a ready state so we can run it!
        requestBody.JobStatus = 'Ready';
        const createJob = await (0, jobUtil_1.CreateJobAsync)(requestBody);
        if (createJob.statusCode === 200) {
            response = createJob;
        }
        if (response.statusCode !== 200) {
            response = {
                statusCode: response === null || response === void 0 ? void 0 : response.statusCode,
                body: JSON.parse(response.body).message,
            };
            res.send(response);
            return;
        }
    }
    catch (e) {
        const msg = `Unable to Run Job: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
        res.send(response);
    }
    res.send(response);
};
exports.createAndRunJob = createAndRunJob;
//# sourceMappingURL=createAndRunJob.js.map