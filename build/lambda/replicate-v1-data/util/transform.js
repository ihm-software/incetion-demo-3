"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const logger_1 = require("./logger");
const transform = async (tableName, updatedData) => {
    try {
        if (tableName.toLowerCase() === 'raptorjob') {
            return transformToJobDocument(updatedData);
        }
        else {
            return transformToJobScheduleDocument(updatedData);
        }
    }
    catch (error) {
        (0, logger_1.log)(`Error while transforming Data to ${tableName} Document-> , ${error}`);
        throw new Error(error);
    }
};
exports.transform = transform;
const transformToJobDocument = (updatedData) => {
    if (updatedData['JobKey'] === undefined) {
        throw new Error('RaptorJob:TransformError:"JobKey" is required');
    }
    if (updatedData['OrganizationID'] === undefined) {
        throw new Error('RaptorJob:TransformError:"OrganizationID" is required');
    }
    const transformedData = {
        mongoDocRefId: '',
        OrganizationID: '',
        JobKey: '',
    };
    Object.keys(updatedData).forEach((keyName) => {
        if (keyName === '_id') {
            transformedData['mongoDocRefId'] = updatedData['_id'];
        }
        else {
            transformedData[keyName] = updatedData[keyName];
        }
    });
    return transformedData;
};
const transformToJobScheduleDocument = (updatedData) => {
    if (updatedData['ScheduleKey'] === undefined) {
        throw new Error('RaptorJobSchedule:TransformError:"ScheduleKey" is required');
    }
    if (updatedData['OrganizationID'] === undefined) {
        throw new Error('RaptorJobSchedule:TransformError:"OrganizationID" is required');
    }
    const transformedData = {
        mongoDocRefId: '',
        OrganizationID: '',
        ScheduleKey: '',
    };
    Object.keys(updatedData).forEach((keyName) => {
        if (keyName === '_id') {
            transformedData['mongoDocRefId'] = updatedData['_id'];
        }
        else {
            transformedData[keyName] = updatedData[keyName];
        }
    });
    return transformedData;
};
//# sourceMappingURL=transform.js.map