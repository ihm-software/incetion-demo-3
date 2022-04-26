"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replayJob = void 0;
const winston_1 = require("winston");
const jobUtil_1 = require("../util/jobUtil");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const replayJob = async (req, res) => {
    const { context, pathParameters } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        console.log(z_cloud_org_id);
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid')) {
            return response;
        }
        logger.info(`entering ${context.functionName}`);
        const jobkey = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.jobkey;
        //TODO ~DB: Before setting this job to 'Ready',
        //we will need to expire all other none COMPLETE or ERROR jobs in the database
        //with the SAME 'JobName', only allow one job per 'JobName' group to be set as Ready/Running at a time!
        //Patch the job back to ready!
        const job = {
            OrganizationID: z_cloud_org_id,
            JobKey: jobkey,
            JobStatus: 'Ready',
        };
        //set the job to 'Ready' - so we can run the job...
        response = await (0, jobUtil_1.PatchJobAsync)(job);
        if (response.statusCode !== 200) {
            response = {
                statusCode: response.statusCode,
                body: JSON.parse(response.body).message,
            };
        }
    }
    catch (err) {
        const msg = `Unable to Replay Job: ${err}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.replayJob = replayJob;
//# sourceMappingURL=replayJob.js.map