"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobInstance = void 0;
const winston_1 = require("winston");
const jobUtil_1 = require("../util/jobUtil");
const mongoDBHelper_1 = require("../util/mongoDBHelper");
const validator_1 = require("../util/validator");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const createJobInstance = async (req, res) => {
    const { pathParameters } = req;
    let response;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next line
        const z_cloud_org_id = req.app._event.headers['z-cloud-org-id'];
        if ((0, validator_1.ValidateGuid)(z_cloud_org_id, response, 'Invalid OrganizationID Guid'))
            return response;
        //Validation
        logger.info(`GET Job: ${pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey}`);
        if (null === (pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey)) {
            const msg = 'Could not GET Job Schedule because of validation errors, valid schedulekey is required.';
            logger.error(msg);
            response = {
                statusCode: 400,
                body: msg,
            };
            res.send(response);
            return;
        }
        conn = await connPromise;
        const validateString = (scheduleKey) => {
            if (!(scheduleKey === null || scheduleKey === void 0 ? void 0 : scheduleKey.length))
                throw new Error('Invalid scheduleKey');
            return scheduleKey;
        };
        //do some validation on jobSchedule
        const scheduleKey = validateString(pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey);
        // read the job schedule from mongo
        const jobSchedule = await conn.collection('RaptorJobSchedule').findOne({
            OrganizationID: z_cloud_org_id,
            ScheduleKey: scheduleKey,
        });
        const validateScheduleJobData = (scheduleData) => {
            validateString(scheduleData.StationID);
            validateString(scheduleData.IntervalType);
            validateString(scheduleData.IntervalCount);
            validateString(scheduleData.RestrictPublicationStatus);
            validateString(scheduleData.PastHours);
            return scheduleData;
        };
        const scheduleData = validateScheduleJobData(jobSchedule.ScheduleJobData);
        if (jobSchedule) {
            logger.info(`CREATING and RUNNING Job for Schedule, OrgID: ${jobSchedule.OrganizationID}. ScheduleKey: ${jobSchedule.ScheduleKey}`);
            // Josh - please have a look and see if we can stop Snyk complaining
            // deepcode ignore Sqli: <please specify a reason of ignoring this>
            const jobRequestData = await (0, jobUtil_1.getJobRequestObjectForJobType)(conn, scheduleData);
            if (jobRequestData !== null) {
                const jobKey = await (0, jobUtil_1.getJobKey)(jobSchedule);
                const jobObj = {
                    OrganizationID: z_cloud_org_id,
                    JobKey: jobKey,
                    JobName: jobKey,
                    JobType: jobSchedule.ScheduleJobType,
                    JobStatus: 'Created',
                    Description: 'Description will be added soon',
                    JobRequestData: jobRequestData,
                    JobCluster: process.env.JobCluster,
                    ScheduleKey: jobSchedule.ScheduleKey,
                };
                logger.info(`CREATE and RUN Job, OrgID: ${jobObj.OrganizationID}. JobKey: ${jobObj.JobKey}`);
                //Create the job and Set the job in a ready state so we can run it!
                jobObj.JobStatus = 'Ready';
                response = await (0, jobUtil_1.CreateJobAsync)(jobObj);
                if (response.statusCode === 200) {
                    response = await (0, jobUtil_1.runJobAsync)(z_cloud_org_id, jobObj.JobKey);
                }
                if (response.statusCode !== 200) {
                    response = {
                        statusCode: response.statusCode,
                        body: JSON.parse(response.body).message,
                    };
                }
            }
            else {
                const msg = `Unable to generate Job Request object for scheduled job ${pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey} `;
                logger.error(msg);
                response = {
                    statusCode: 500,
                    body: msg,
                };
            }
        }
        else {
            const msg = `Cannot find job schedule for schedule key ${pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.schedulekey} in the database`;
            logger.error(msg);
            response = {
                statusCode: 404,
                body: msg,
            };
        }
    }
    catch (e) {
        const msg = `Unable to Run Job for the schedule: ${e}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    res.send(response);
};
exports.createJobInstance = createJobInstance;
//# sourceMappingURL=createJobInstance.js.map