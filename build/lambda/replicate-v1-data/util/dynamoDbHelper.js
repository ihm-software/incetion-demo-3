"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteData = exports.addOrUpdateData = void 0;
const logger_1 = require("./logger");
const aws_sdk_1 = require("aws-sdk");
const consts_1 = require("./consts");
const apiVersion = '2012-08-10';
const docClient = new aws_sdk_1.DynamoDB.DocumentClient({
    apiVersion: apiVersion,
    region: 'us-east-1',
});
const addOrUpdateData = async (tableName, data) => {
    try {
        await docClient
            .put({
            TableName: tableName,
            Item: data,
        })
            .promise();
        (0, logger_1.log)('Dynamodb:addOrUpdateData:success');
        return true;
    }
    catch (error) {
        (0, logger_1.log)('Dynamodb:addOrUpdateData:Error: ', error);
        throw new Error('DynamoDb:addOrUpdateData:Error');
    }
};
exports.addOrUpdateData = addOrUpdateData;
const deleteData = async (tableName, previousData) => {
    try {
        const key = tableName === consts_1.RAPTOR_JOB_TABLE
            ? {
                JobKey: previousData['JobKey'],
                OrganizationID: previousData['OrganizationID'],
            }
            : {
                ScheduleKey: previousData['ScheduleKey'],
                OrganizationID: previousData['OrganizationID'],
            };
        await docClient
            .delete({
            TableName: tableName,
            Key: key,
        })
            .promise();
        (0, logger_1.log)('Dynamodb:deleteData:success');
        return true;
    }
    catch (error) {
        (0, logger_1.log)('Dynamodb:deleteData:Error: ', error);
        throw new Error('DynamoDb:deleteData:Error');
    }
};
exports.deleteData = deleteData;
//# sourceMappingURL=dynamoDbHelper.js.map