"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRefactorStack = void 0;
const soundplus_cdk_1 = require("soundplus-cdk");
const createJobGateway_1 = require("./createJobGateway");
// import {createLoadBalancing} from './createLoadBalancing';
const createJobReplicationAssets_1 = require("./createJobReplicationAssets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const getLambdaPath_1 = require("../lambda/util/src/getLambdaPath");
class JobRefactorStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const createDynamoDB = () => { };
        createDynamoDB();
        const jobRunScheduledLambda = (0, soundplus_cdk_1.createLambda)(this, 'scheduled-job', (0, getLambdaPath_1.getAbsoluteLambdaPath)('scheduled-job'));
        new aws_events_1.Rule(this, 'scheduled-job-rule', {
            schedule: aws_events_1.Schedule.cron({ minute: '0/1', hour: '*', day: '*', month: '*', year: '*' }),
            targets: [new aws_events_targets_1.LambdaFunction(jobRunScheduledLambda)],
        });
        // createLoadBalancing(this, props);
        const railsApiLambda = (0, soundplus_cdk_1.createLambda)(this, 'rails-api', (0, getLambdaPath_1.getAbsoluteLambdaPath)('rails-api'));
        (0, createJobGateway_1.createJobGateway)(this, railsApiLambda, props);
        (0, createJobReplicationAssets_1.createJobReplicationAssets)(this, props);
        // Create pipeline per job including the below (rules + queues + lambda)
        // const xJobScheduleQueues = createQueuePair(this, 'x-job-schedule-publisher' + props.env?.region, props);
        // const xJobImmediateQueues = createQueuePair(this, 'x-job-immediate-publisher' + props.env?.region, props);
        // const gsSyncScheduleQueues = createQueuePair(this, 'x-gs-sync-schedule' + props.env?.region, props);
        // const gsSyncmmediateQueues = createQueuePair(this, 'x-gs-sync-immediate' + props.env?.region, props);
        // runScheduledJobLambda.addEnvironment('QUEUE_URL', xJobScheduleQueues.queue.queueUrl);
        // runScheduledJobLambda.addEnvironment('QUEUE_URL', xJobImmediateQueues.queue.queueUrl);
        // xJobScheduleQueues.queue.grantSendMessages(runScheduledJobLambda);
        // xJobImmediateQueues.queue.grantSendMessages(runScheduledJobLambda);
        // what is this for?
        // createQueueLambda(this, 'x-job-schedule', xJobScheduleQueues)
        //     .addEnvironment('QUEUE_URL', xJobScheduleQueues.queue.queueUrl)
        //     .addToRolePolicy(
        //         new PolicyStatement({
        //             actions: ['ssm:GetParameters', 'ssm:GetParametersByPath', 'sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        //             resources: ['*'],
        //         })
        //     );
        // createQueueLambda(this, 'x-job-schedule-dl-processor', {queue: xJobScheduleQueues.queue, deadLetter: undefined})
        //     .addEnvironment('QUEUE_URL', xJobScheduleQueues.queue.queueUrl)
        //     .addToRolePolicy(
        //         new PolicyStatement({
        //             actions: ['ssm:GetParameters', 'ssm:GetParametersByPath', 'sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        //             resources: ['*'],
        //         })
        //     );
        // ------- what is this for? //
        // createEventBridgeRules(
        //     this,
        //     // gsSyncScheduleQueues.queue,
        //     // gsSyncmmediateQueues.queue,
        //     // xJobScheduleQueues.queue,
        //     // xJobImmediateQueues.queue,
        //     runScheduledJobLambda
        // );
    }
}
exports.JobRefactorStack = JobRefactorStack;
//# sourceMappingURL=job-refactor-stack.js.map