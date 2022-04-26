declare const context: {
    callbackWaitsForEmptyEventLoop: boolean;
    succeed: () => void;
    fail: () => void;
    done: () => void;
    awsRequestId: string;
    clientContext: undefined;
    functionName: string;
    functionVersion: string;
    identity: undefined;
    invokedFunctionArn: string;
    logGroupName: string;
    logStreamName: string;
    memoryLimitInMB: string;
    getRemainingTimeInMillis: () => number;
};
