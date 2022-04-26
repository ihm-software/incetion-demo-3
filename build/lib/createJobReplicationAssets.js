"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobReplicationAssets = void 0;
const soundplus_cdk_1 = require("soundplus-cdk");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const getLambdaPath_1 = require("../lambda/util/src/getLambdaPath");
const createJobReplicationAssets = (scope, props) => {
    var _a, _b, _c;
    // create JobDataReplicate lambda for Job and JobSchedule Mongo Triggers
    const lambdaName = 'replicate-v1-data';
    const jobDataReplicateDLQ = (0, soundplus_cdk_1.createDLQueue)(scope, lambdaName + ((_a = props.env) === null || _a === void 0 ? void 0 : _a.region), props);
    const jobDataReplicateLambda = (0, soundplus_cdk_1.createLambda)(scope, lambdaName, (0, getLambdaPath_1.getAbsoluteLambdaPath)(lambdaName));
    jobDataReplicateLambda.configureAsyncInvoke({
        retryAttempts: 2,
    });
    jobDataReplicateLambda.addEnvironment('QUEUE_URL', jobDataReplicateDLQ.queueUrl);
    jobDataReplicateDLQ.grantSendMessages(jobDataReplicateLambda);
    jobDataReplicateLambda.addToRolePolicy(new aws_iam_1.PolicyStatement({
        actions: ['ssm:GetParameters', 'ssm:GetParametersByPath', 'sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        resources: ['*'],
    }));
    new aws_events_1.Rule(scope, 'eventbridgeJobRule', {
        eventBus: aws_events_1.EventBus.fromEventBusName(scope, 'eventbusJob', aws_cdk_lib_1.Fn.importValue('dev-us-east-1-SoundplusMessagingStack:devuseast1SoundplusMessagingStackExportsOutputRefeventbridgeRaptorJobLambdaCF09045CAC90C6C5').toString()),
        eventPattern: {
            account: [(_b = props.env) === null || _b === void 0 ? void 0 : _b.account],
        },
    }).addTarget(new aws_events_targets_1.LambdaFunction(jobDataReplicateLambda));
    new aws_events_1.Rule(scope, 'eventbridgeJobScheduleRule', {
        eventBus: aws_events_1.EventBus.fromEventBusName(scope, 'eventbusJobSchedule', aws_cdk_lib_1.Fn.importValue('dev-us-east-1-SoundplusMessagingStack:devuseast1SoundplusMessagingStackExportsOutputRefeventbridgeRaptorJobScheduleCE99ED2BE4DBCEB8').toString()),
        eventPattern: {
            account: [(_c = props.env) === null || _c === void 0 ? void 0 : _c.account],
        },
    }).addTarget(new aws_events_targets_1.LambdaFunction(jobDataReplicateLambda));
};
exports.createJobReplicationAssets = createJobReplicationAssets;
//# sourceMappingURL=createJobReplicationAssets.js.map