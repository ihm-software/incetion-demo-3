"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduledJob = void 0;
const dataRepository_1 = require("./dataRepository");
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const cron_converter_1 = __importDefault(require("cron-converter"));
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class ScheduledJobError extends Error {
}
const getParameter = async (parameterStoreUtil, path) => {
    const paramResponse = await parameterStoreUtil.getEncryptedParameter(path);
    if (paramResponse instanceof Error)
        throw paramResponse;
    return paramResponse;
};
const getSecret = async (secretsManagerUtil, path) => {
    const apiKey = await secretsManagerUtil.getSecret(path);
    if (!apiKey)
        throw new ScheduledJobError(`Failed to load ${path} from AWS Secrets Manager`);
    return apiKey;
};
const getToken = async (tokenUtil) => {
    const token = await tokenUtil.getAuthToken();
    if (!token)
        throw new ScheduledJobError('Failed to load Authentication token');
    return token;
};
const getExistingJobMessage = (scheduleKey) => `There is already an active job created from the schedule with key ${scheduleKey}. A new job will not be created for the job schedule.`;
const getExistingJobResponse = (item) => {
    return {
        isOK: true,
        scheduleKey: `${item.ScheduleKey}`,
        message: getExistingJobMessage(item),
    };
};
const hasExistingActiveJob = (log, item, jobs) => {
    if (jobs && jobs.Items && jobs.Items.length > 0) {
        log.info(getExistingJobMessage(item.ScheduleKey));
        return true;
    }
    return false;
};
const getNextRunFromSchedule = (schedule) => {
    const cronInstance = new cron_converter_1.default({
        timezone: 'UTC',
    });
    cronInstance.fromString(schedule);
    return cronInstance.schedule().next().format();
};
const getScheduleCount = (item) => (item.ScheduledJobsCount ? item.ScheduledJobsCount + 1 : 1);
const updateScheduledJobSuccess = 'Successfully updated the RaptorJobSchedule entry';
const updateScheduledJob = async (log, utcNow, item, dynamoDB) => {
    const updateRaptorJobScheduleStatement = `UPDATE RaptorJobSchedule 
    SET LastRunDateTime = '${utcNow}'
        , NextRunDateTime = '${getNextRunFromSchedule(item.CronSchedule)}'
        , ScheduledJobsCount = ${getScheduleCount(item)}
    WHERE ScheduleKey = '${item.ScheduleKey}'
    AND OrganizationID = '${item.OrganizationID}'`;
    try {
        const updateRaptorJobSchedule = await dynamoDB.executeStatement({ Statement: updateRaptorJobScheduleStatement });
        log.info(`${updateScheduledJobSuccess} \nStatement: ${updateRaptorJobScheduleStatement} \nResult: ${updateRaptorJobSchedule}`);
    }
    catch (unknownError) {
        log.error(`Failed to update the RaptorJobSchedule entry. \nStatement: ${updateRaptorJobScheduleStatement}`, unknownError);
    }
};
const scheduleImmediateJob = async (log, dynamoDB, apiUrl, apiKey, token, item, utcNow) => {
    try {
        /** For each schedule trigger creation of a Job, by hitting the Load Balancer
         * prepare a call to create a job instance
         */
        const jobInstanceURL = `${apiUrl}/job/schedule/jobInstance/${item.ScheduleKey}`;
        const response = await axios_1.default.post(jobInstanceURL, null, {
            headers: {
                'User-Agent': 'Request-Promise',
                'X-Api-Key': apiKey,
                'z-cloud-org-id': item.OrganizationID,
                Authorization: `${token}`,
            },
        });
        updateScheduledJob(log, utcNow, item, dynamoDB);
        log.info(`Successfully scheduled job for : ${item.ScheduleKey} | Create job instance URL: ${jobInstanceURL}.`, response.data);
    }
    catch (unknownError) {
        const err = unknownError;
        const msg = `Failed to schedule job instance for the job schedule with key ${item.ScheduleKey}. Error: ${err}`;
        log.error(msg, err, err.stack);
    }
};
const runScheduledJob = async (log, dynamoDB, parameterStoreUtil, secretsManagerUtil, tokenUtil) => {
    var _a;
    try {
        const utcNow = (0, moment_1.default)().utc().format();
        const apiUrl = await getParameter(parameterStoreUtil, '/soundplus/api/url');
        const apiKey = await getSecret(secretsManagerUtil, '/soundplus/api/key');
        const token = await getToken(tokenUtil);
        await (0, dataRepository_1.setNextRunDateTimeForNewJobSchedules)(log, dynamoDB);
        const dueSchedules = await (0, dataRepository_1.getDueSchedules)(utcNow, log, dynamoDB);
        const responses = (_a = dueSchedules === null || dueSchedules === void 0 ? void 0 : dueSchedules.Items) === null || _a === void 0 ? void 0 : _a.map(async (dbItem) => {
            const item = (0, util_dynamodb_1.unmarshall)(dbItem);
            const jobs = await (0, dataRepository_1.getActiveJobsWithScheduleKey)(item.ScheduleKey, log, dynamoDB);
            return hasExistingActiveJob(log, item, jobs)
                ? getExistingJobResponse(item)
                : scheduleImmediateJob(log, dynamoDB, apiUrl, apiKey, token, item, utcNow);
        });
        responses && (await Promise.all(responses));
    }
    catch (err) {
        if (err instanceof ScheduledJobError) {
            const error = err;
            log.error(error.message);
        }
        const error = err;
        log.error('Error in Running JobScheduledLambda', error);
    }
};
exports.runScheduledJob = runScheduledJob;
//# sourceMappingURL=runScheduledJob.js.map