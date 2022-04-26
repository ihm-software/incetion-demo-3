"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJob = void 0;
const winston_1 = require("winston");
const jobUtil_1 = require("../util/jobUtil");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const runJob = async (req, res) => {
    const { pathParameters } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid'))
            return response;
        const jobKey = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.jobkey;
        response = await (0, jobUtil_1.runJobAsync)(z_cloud_org_id, jobKey);
    }
    catch (e) {
        const msg = `Unable to Run Job: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.runJob = runJob;
//# sourceMappingURL=runJob.js.map