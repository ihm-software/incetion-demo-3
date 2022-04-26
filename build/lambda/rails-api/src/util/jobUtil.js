"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobKey = exports.getJobRequestObjectForJobType = exports.runJobAsync = exports.AddOrUpdateJobAsync = exports.PatchJobAsync = exports.PutJobAsync = exports.CreateJobAsync = exports.GetJobAsync = void 0;
const mongoDBHelper_1 = require("./mongoDBHelper");
const winston_1 = require("winston");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const uuid_1 = require("uuid");
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const connPromise = (0, mongoDBHelper_1.getConnection)();
let conn;
const GetJobAsync = async (orgId, jobKey) => submitGetJobAsync(orgId, jobKey);
exports.GetJobAsync = GetJobAsync;
const CreateJobAsync = async (body) => submitCreateJobAsync(body);
exports.CreateJobAsync = CreateJobAsync;
const PutJobAsync = async (body) => submitPutJobAsync(body);
exports.PutJobAsync = PutJobAsync;
const PatchJobAsync = async (body) => submitPatchJobAsync(body);
exports.PatchJobAsync = PatchJobAsync;
const AddOrUpdateJobAsync = async (body) => submitAddOrUpdateJobAsync(body);
exports.AddOrUpdateJobAsync = AddOrUpdateJobAsync;
const prepareRaptorJobObject = (raptorObj) => {
    switch (raptorObj.JobStatus) {
        case 'Scheduled':
            raptorObj.ScheduledDateTime = new Date();
            break;
        case 'Running':
            raptorObj.RunningDateTime = new Date();
            break;
        case 'Completed':
            raptorObj.CompletedDateTime = new Date();
            break;
    }
    //Sets the modified date to the latest..
    raptorObj.ModifiedDateTime = new Date();
    //READONLY DATA - should not be posted to the DB
    //CreatedDateTime is tracked by using _id (READONLY)
    delete raptorObj.CreatedDateTime;
    //remove all undefined objects
    Object.keys(raptorObj).forEach(key => raptorObj[key] === undefined && delete raptorObj[key]);
    return raptorObj;
};
const submitGetJobAsync = async (orgId, jobKey) => {
    let response;
    conn = await connPromise;
    const resultJson = await conn.collection('RaptorJob').findOne({ OrganizationID: orgId, JobKey: jobKey });
    if (resultJson !== null) {
        resultJson.CreatedDateTime = resultJson._id.getTimestamp();
        delete resultJson._id;
        response = {
            statusCode: 200,
            body: JSON.stringify(resultJson),
        };
    }
    else {
        const msg = `Could not GET Job because OrgID = ${orgId} JobKey = ${jobKey} was not found`;
        logger.error(msg);
        response = {
            statusCode: 404,
            body: msg,
        };
    }
    return response;
};
const submitPutJobAsync = async (jobObj) => {
    logger.info('Entering submitPutJobAsync');
    let response;
    conn = await connPromise;
    const raptorObj = prepareRaptorJobObject(jobObj); //Set Modified time and remove undefines..
    //Make sure the job has a name....
    if (!raptorObj.JobName) {
        raptorObj.JobName = raptorObj.JobKey;
    }
    //Make suer we have a job cluster
    if (!raptorObj.JobCluster) {
        raptorObj.JobCluster = process.env.CLUSTER;
    }
    const upserted = await conn
        .collection('RaptorJob')
        .findOneAndReplace({ OrganizationID: raptorObj.OrganizationID, JobKey: raptorObj.JobKey }, raptorObj, { upsert: true, returnOriginal: false });
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
        const msg = `Could not PUT Job during database operation, JobKey ${raptorObj.JobKey}`;
        response = {
            statusCode: 400,
            body: JSON.stringify(msg),
        };
    }
    return response;
};
const submitCreateJobAsync = async (jobObj) => {
    logger.info('Entering submitCreateJobAsync');
    let response;
    conn = await connPromise;
    const raptorObj = prepareRaptorJobObject(jobObj); //Set Modified time and remove undefines..
    //Make sure the job has a name....
    if (!raptorObj.JobName) {
        raptorObj.JobName = raptorObj.JobKey;
    }
    //Make suer we have a job cluster
    if (!raptorObj.JobCluster) {
        raptorObj.JobCluster = process.env.CLUSTER;
    }
    const inserted = await conn.collection('RaptorJob').insertOne(raptorObj);
    if (inserted.insertedCount === 1) {
        raptorObj.CreatedDateTime = raptorObj._id.getTimestamp();
        delete raptorObj._id;
        response = {
            statusCode: 200,
            body: JSON.stringify(raptorObj),
        };
    }
    else {
        const msg = `Could not CREATE Job during database operation, JobKey ${raptorObj}`;
        response = {
            statusCode: 400,
            body: JSON.stringify(msg),
        };
    }
    return response;
};
const submitPatchJobAsync = async (jobObj) => {
    logger.info('Entering submitPatchJobAsync');
    let response;
    conn = await connPromise;
    const raptorObj = prepareRaptorJobObject(jobObj); //Set Modified time and remove undefines..
    //---- CASE REPLACE PATCH
    //Need to do special merge patched, with Arrays that have KEYS
    const updateObject = await (0, mongoDBHelper_1.generateUpdateObject)(raptorObj, ['OrganizationID', 'JobKey'], ['JobResultData']);
    logger.info(`Update Object ${JSON.stringify(updateObject.set)} - ${JSON.stringify(updateObject.push)} - ${JSON.stringify(updateObject.unset)}`);
    const find = await conn.collection('RaptorJob').findOneAndUpdate({
        JobKey: raptorObj.JobKey,
        OrganizationID: raptorObj.OrganizationID,
    }, { ...(updateObject.set && { $set: updateObject.set }), ...(updateObject.unset && { $unset: updateObject.unset }) }, { returnOriginal: false });
    if (find.ok) {
        response = {
            statusCode: 200,
            body: JSON.stringify(raptorObj),
        };
    }
    else {
        const msg = `Problem during PATCH on Job, OrganizationID: ${raptorObj.OrganizationID}, JobKey ${raptorObj.JobKey}.\r\nResult: ${JSON.stringify(find)}`;
        response = {
            statusCode: 400,
            body: JSON.stringify(msg),
        };
    }
    return response;
};
const submitAddOrUpdateJobAsync = async (jobObj) => {
    logger.info('Entering submitAddOrUpdateJobAsync');
    let response;
    conn = await connPromise;
    const raptorObj = prepareRaptorJobObject(jobObj); //Set Modified time and remove undefines..
    //---- CASE REPLACE PATCH
    //Need to do special merge patched, with Arrays that have KEYS
    const updateObject = await (0, mongoDBHelper_1.generateUpdateObject)(raptorObj, ['OrganizationID', 'JobKey'], ['JobResult']);
    logger.info(`Update Object ${JSON.stringify(updateObject.set)} - ${JSON.stringify(updateObject.push)} - ${JSON.stringify(updateObject.unset)}`);
    const patchOrInsertResponse = await conn.collection('RaptorJob').findOneAndUpdate({
        JobKey: raptorObj.JobKey,
        OrganizationID: raptorObj.OrganizationID,
    }, { ...(updateObject.set && { $set: updateObject.set }), ...(updateObject.unset && { $unset: updateObject.unset }) }, { upsert: true, returnOriginal: false });
    if (patchOrInsertResponse.ok) {
        //if we created a record return the created datetime
        if (patchOrInsertResponse.value &&
            patchOrInsertResponse.lastErrorObject &&
            !patchOrInsertResponse.lastErrorObject.updatedExisting &&
            patchOrInsertResponse.value._id) {
            raptorObj.CreatedDateTime = patchOrInsertResponse.value._id.getTimestamp();
            delete raptorObj._id;
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(raptorObj),
        };
    }
    else {
        const msg = `Problem during AddOrUpdate Job, OrganizationID: ${raptorObj.OrganizationID}, JobKey ${raptorObj.JobKey}.\r\nResult: ${JSON.stringify(patchOrInsertResponse)}`;
        response = {
            statusCode: 400,
            body: JSON.stringify(msg),
        };
    }
    return response;
};
const runJobAsync = async (z_cloud_org_id, jobkey) => {
    let response = {
        statusCode: 400,
        body: {},
    };
    try {
        //Get job from database
        conn = await connPromise;
        const job = await conn.collection('RaptorJob').findOne({ OrganizationID: z_cloud_org_id, JobKey: jobkey }, { projection: { _id: 0 } });
        console.log(job);
        response = {
            statusCode: 200,
            body: JSON.stringify(job),
        };
        if (job) {
            if (job.JobStatus !== 'Ready') {
                //Can't schedule the job the job does not have a status of ready!
                const msg = 'Unable to run Job: must have a "Ready" Status';
                logger.error(msg);
                response = {
                    statusCode: 400,
                    body: msg,
                };
            }
        }
    }
    catch (err) {
        const msg = `Unable to Run Job: ${err}`;
        logger.error(msg);
        response = {
            statusCode: 500,
            body: msg,
        };
    }
    logger.info(response);
    return response;
};
exports.runJobAsync = runJobAsync;
const getUTCTimeWRTCurrentTimezone = (dateToBeCoverted) => {
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`Current TimeZone - ${currentTimeZone}`);
    return (0, date_fns_tz_1.zonedTimeToUtc)(dateToBeCoverted, currentTimeZone);
};
const getJobRequestObjectForJobType = async (conn, jobschedule) => {
    if (jobschedule) {
        const jobRequestData = null;
        switch (jobschedule.ScheduleJobType) {
            case 'GSSchedSync':
                if (jobschedule.ScheduleJobData) {
                    const data = jobschedule.ScheduleJobData;
                    if (data.StationID) {
                        if (data.IntervalType && data.IntervalCount) {
                            // check if schedule exists for tomorrow and n days post that...
                            const stationObj = await conn.collection('RaptorStation').findOne({
                                OrganizationID: jobschedule.OrganizationID,
                                StationID: data.StationID,
                            });
                            if (stationObj) {
                                let dates = [];
                                const startOfTommorrowLocalTimeInUTC = getUTCTimeWRTCurrentTimezone((0, date_fns_1.startOfTomorrow)());
                                const startOfTomorrowForStation = (0, date_fns_tz_1.utcToZonedTime)(startOfTommorrowLocalTimeInUTC, stationObj.StationTimeZone);
                                console.log(`Start of tomorrow ${startOfTomorrowForStation} - timezone ${stationObj.StationTimeZone}`);
                                const stationDateTimeUTC = (0, date_fns_tz_1.zonedTimeToUtc)(startOfTomorrowForStation, stationObj.StationTimeZone);
                                console.log(`Station time as UTC ${stationDateTimeUTC} - timezone ${stationObj.StationTimeZone}`);
                                if ((data.IntervalType === 1 || data.IntervalType === 2) && data.IntervalCount > 0) {
                                    dates = getDateAndHoursBetween(stationDateTimeUTC, data.IntervalType === '1' ? data.IntervalCount * 24 : data.IntervalCount);
                                }
                                else {
                                    dates = getDateAndHoursBetween(stationDateTimeUTC, 24);
                                }
                                // fetching following dates
                                console.log(`fetching following dates = ${dates}`);
                                return {
                                    OrganizationID: jobschedule.OrganizationID,
                                    StationID: stationObj.StationID,
                                    DateAndHours: dates,
                                };
                            }
                        }
                    }
                }
                break;
            case 'GSScheduleRecon':
                if (jobschedule.ScheduleJobData) {
                    const data = jobschedule.ScheduleJobData;
                    if (data.StationID) {
                        if (data.IntervalType && data.IntervalCount) {
                            // check if schedule exists for tomorrow and n days post that...
                            const stationObj = await conn.collection('RaptorStation').findOne({
                                OrganizationID: jobschedule.OrganizationID,
                                StationID: data.StationID,
                            });
                            if (stationObj) {
                                let dates = [];
                                if (data.IntervalType === 1) {
                                    const startOfYesterdayLocalTime = getUTCTimeWRTCurrentTimezone((0, date_fns_1.startOfYesterday)());
                                    const startOfYesterdayForStation = (0, date_fns_tz_1.utcToZonedTime)(startOfYesterdayLocalTime, stationObj.StationTimeZone);
                                    const stationDateTimeUTC = (0, date_fns_tz_1.zonedTimeToUtc)(startOfYesterdayForStation, stationObj.StationTimeZone);
                                    dates = getDateAndHoursBetween(stationDateTimeUTC, data.IntervalCount > 0 ? data.IntervalCount * 24 : 24);
                                }
                                else if (data.IntervalType === 2) {
                                    const startOfPreviousHoursLocalTime = (0, date_fns_1.subHours)(getUTCTimeWRTCurrentTimezone((0, date_fns_1.startOfHour)(new Date())), data.IntervalCount > 0 ? data.IntervalCount : 1);
                                    const startOfPreviousHourForStation = (0, date_fns_tz_1.utcToZonedTime)(startOfPreviousHoursLocalTime, stationObj.StationTimeZone);
                                    const stationDateTimeUTC = (0, date_fns_tz_1.zonedTimeToUtc)(startOfPreviousHourForStation, stationObj.StationTimeZone);
                                    dates = getDateAndHoursBetween(stationDateTimeUTC, data.IntervalCount > 0 ? data.IntervalCount : 1);
                                }
                                // fetching following dates
                                console.log(`fetching following dates = ${dates}`);
                                return {
                                    OrganizationID: jobschedule.OrganizationID,
                                    StationID: stationObj.StationID,
                                    StartDateTime: dates[0],
                                    EndDateTime: dates[dates.length - 1],
                                };
                            }
                        }
                    }
                }
                break;
            case 'GSAssetPullLatest':
                if (jobschedule.ScheduleJobData) {
                    const data = jobschedule.ScheduleJobData;
                    if (data.StationID) {
                        const stationObj = await conn.collection('RaptorStation').findOne({
                            OrganizationID: jobschedule.OrganizationID,
                            StationID: data.StationID,
                        });
                        if (stationObj) {
                            return {
                                OrganizationID: jobschedule.OrganizationID,
                                StationID: stationObj.StationID,
                            };
                        }
                    }
                }
                break;
            case 'GSSchedPullLatest':
                if (jobschedule.ScheduleJobData) {
                    const data = jobschedule.ScheduleJobData;
                    if (data.StationID) {
                        const stationObj = await conn.collection('RaptorStation').findOne({
                            OrganizationID: jobschedule.OrganizationID,
                            StationID: data.StationID,
                        });
                        if (stationObj) {
                            return {
                                OrganizationID: jobschedule.OrganizationID,
                                StationID: stationObj.StationID,
                                RestrictPublicationStatus: data.RestrictPublicationStatus,
                                PastHours: data.PastHours,
                            };
                        }
                    }
                }
                break;
            case 'FTPIngest':
                if (jobschedule.ScheduleJobData) {
                    return jobschedule.ScheduleJobData;
                }
                break;
            default:
                break;
        }
        return jobRequestData;
    }
    return null;
};
exports.getJobRequestObjectForJobType = getJobRequestObjectForJobType;
const getJobKey = async (jobschedule) => {
    if (jobschedule) {
        switch (jobschedule.ScheduleJobType) {
            case 'GSSchedSync':
                return `sched-${jobschedule.ScheduleJobType}-${(0, uuid_1.v4)()}`;
            default:
                return `sched-${jobschedule.ScheduleJobType}-${(0, uuid_1.v4)()}`;
        }
    }
    return null;
};
exports.getJobKey = getJobKey;
const getDateAndHoursBetween = (startDate, numOfHours) => {
    const dates = [];
    // Strip hours minutes seconds etc.
    let currentDateAndHour = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), 0, 0);
    const endDateAndHour = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours() + (numOfHours - 1), 0, 0);
    while (currentDateAndHour <= endDateAndHour) {
        dates.push(currentDateAndHour);
        currentDateAndHour = new Date(currentDateAndHour.getFullYear(), currentDateAndHour.getMonth(), currentDateAndHour.getDate(), currentDateAndHour.getHours() + 1 // Will increase date if over range
        );
    }
    return dates;
};
//# sourceMappingURL=jobUtil.js.map