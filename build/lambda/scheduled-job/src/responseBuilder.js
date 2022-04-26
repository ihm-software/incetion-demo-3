"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseBuilder = void 0;
const getResponseBuilder = (context) => {
    return {
        getResponse: (statusCode, msg, results) => {
            return {
                statusCode: statusCode,
                body: JSON.stringify({
                    message: msg,
                    functionName: context.functionName,
                    results,
                }),
            };
        },
    };
};
exports.getResponseBuilder = getResponseBuilder;
//# sourceMappingURL=responseBuilder.js.map