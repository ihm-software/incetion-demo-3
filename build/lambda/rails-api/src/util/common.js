"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobKey = exports.getJobRequestObjectForJobType = exports.prepareRaptorJobScheduleObject = void 0;
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const prepareRaptorJobScheduleObject = (raptorObj) => {
    //Sets the modified date to the latest..
    raptorObj.ModifiedDateTime = new Date();
    raptorObj.JobCluster = process.env.CLUSTER;
    //READONLY DATA - should not be posted to the DB
    //CreatedDateTime is tracked by using _id (READONLY)
    delete raptorObj.CreatedDateTime;
    //remove all undefined objects
    Object.keys(raptorObj).forEach(key => raptorObj[key] === undefined && delete raptorObj[key]);
    return raptorObj;
};
exports.prepareRaptorJobScheduleObject = prepareRaptorJobScheduleObject;
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
const getUTCTimeWRTCurrentTimezone = (dateToBeConverted) => {
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`Current TimeZone - ${currentTimeZone}`);
    return (0, date_fns_tz_1.zonedTimeToUtc)(dateToBeConverted, currentTimeZone);
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
                                const startOfTomorrowLocalTimeInUTC = getUTCTimeWRTCurrentTimezone((0, date_fns_1.startOfTomorrow)());
                                const startOfTomorrowForStation = (0, date_fns_tz_1.utcToZonedTime)(startOfTomorrowLocalTimeInUTC, stationObj.StationTimeZone);
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
//# sourceMappingURL=common.js.map