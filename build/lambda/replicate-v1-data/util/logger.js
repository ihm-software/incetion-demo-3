"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEventData = exports.log = void 0;
const debug = (_a = process.env.DEBUG === 'true') !== null && _a !== void 0 ? _a : false;
const log = (text, o) => {
    if (debug)
        console.log(text, o);
};
exports.log = log;
const logEventData = (eventData) => {
    const { operationType, tableName, previousData, updatedData, updateDescription } = eventData;
    (0, exports.log)('Incoming Event Data: ', {
        OperationType: operationType,
        TableName: tableName,
        PreviousData: previousData,
        UpdatedData: updatedData,
        UpdateDescription: updateDescription,
    });
    return;
};
exports.logEventData = logEventData;
//# sourceMappingURL=logger.js.map