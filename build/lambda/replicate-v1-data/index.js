"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobDataReplicateHandler = void 0;
const transform_1 = require("./util/transform");
const logger_1 = require("./util/logger");
const dynamoDbHelper_1 = require("./util/dynamoDbHelper");
const lodash_1 = require("lodash");
const consts_1 = require("./util/consts");
const jobDataReplicateHandler = async function (event) {
    try {
        (0, logger_1.log)('--- Starting Job Data Replicate lambda ---');
        const operationType = event.detail.operationType;
        const tableName = event.detail.ns.coll;
        const updatedData = event.detail.fullDocument;
        const previousData = event.detail.fullDocumentBeforeChange;
        const updateDescription = event.detail.updateDescription;
        (0, logger_1.logEventData)({ operationType, tableName, previousData, updatedData, updateDescription });
        if (operationType === 'delete') {
            if ((0, lodash_1.isUndefined)(previousData)) {
                throw new Error('RaptorJob:Error:`fullDocumentBeforeChange` is required to delete the data.');
            }
            await (0, dynamoDbHelper_1.deleteData)(tableName, previousData);
        }
        else {
            if ((0, lodash_1.isUndefined)(updatedData)) {
                throw new Error('RaptorJob:Error:`fullDocument` is required to add or update the data.');
            }
            const transformedData = await (0, transform_1.transform)(tableName, updatedData);
            // Case: If any of the keys gets changed in mongoDb then we need to delete the document in dynamodb as updating keys is not supported. So we will first delete the document and will add it again with updated keys
            if (!(0, lodash_1.isUndefined)(updateDescription) && !(0, lodash_1.isUndefined)(previousData)) {
                if ((tableName === consts_1.RAPTOR_JOB_TABLE && (0, lodash_1.intersection)(Object.keys(updateDescription.updatedFields), consts_1.RAPTOR_JOB_TABLE_KEYS).length > 0) ||
                    (tableName === consts_1.RAPTOR_JOB_SCHEDULE_TABLE &&
                        (0, lodash_1.intersection)(Object.keys(updateDescription.updatedFields), consts_1.RAPTOR_JOB_SCHEDULE_TABLE_KEYS).length > 0)) {
                    await (0, dynamoDbHelper_1.deleteData)(tableName, previousData);
                }
            }
            await (0, dynamoDbHelper_1.addOrUpdateData)(tableName, transformedData);
        }
        (0, logger_1.log)('JobDataReplicateLambda:Success');
        return true;
    }
    catch (error) {
        (0, logger_1.log)('JobDataReplicateLambda:Error: ', error);
        return false;
    }
};
exports.jobDataReplicateHandler = jobDataReplicateHandler;
exports.handler = exports.jobDataReplicateHandler;
//# sourceMappingURL=index.js.map