"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventBridgeRules = void 0;
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const createEventBridgeRules = (scope, 
// gsSyncScheduleQueue: IQueue,
// gsSyncmmediateQueue: IQueue,
xJobScheduleQueue, xJobImmediateQueue, runScheduledJobLambda) => {
    new aws_events_1.Rule(scope, 'runJobScheduleRule', {
        schedule: aws_events_1.Schedule.cron({ minute: '0/1', hour: '*', day: '*', month: '*', year: '*' }),
        targets: [new aws_events_targets_1.LambdaFunction(runScheduledJobLambda)],
    });
    const bus = new aws_events_1.EventBus(scope, 'bus', {
        eventBusName: 'Job-V2-EventBridge',
    });
    // new Rule(scope, 'gsSyncScheduleRule', {
    //     description: 'gsSyncScheduleRule',
    //     enabled: true,
    //     eventBus: bus,
    //     eventPattern: {
    //         detailType: ['/schedule/scheduledJob'],
    //     },
    //     ruleName: 'gsSyncScheduleRule',
    //     targets: [new SqsQueue(gsSyncScheduleQueue)],
    // });
    // new Rule(scope, 'gsSyncImmediateRule', {
    //     description: 'gsSyncImmediateRule',
    //     enabled: true,
    //     eventBus: bus,
    //     eventPattern: {
    //         detailType: ['/schedule/runJob'],
    //     },
    //     ruleName: 'gsSyncImmediateRule',
    //     targets: [new SqsQueue(gsSyncmmediateQueue)],
    // });
    new aws_events_1.Rule(scope, 'xJobScheduleRule', {
        description: 'xJobScheduleRule',
        enabled: true,
        eventBus: bus,
        eventPattern: {
            detailType: ['/ScheduleJob'],
        },
        ruleName: 'xJobScheduleRule',
        targets: [new aws_events_targets_1.SqsQueue(xJobScheduleQueue)],
    });
    new aws_events_1.Rule(scope, 'xJobImmediateRule', {
        description: 'xJobImmediateRule',
        enabled: true,
        eventBus: bus,
        eventPattern: {
            detailType: ['/runJob'],
        },
        ruleName: 'xJobImmediateRule',
        targets: [new aws_events_targets_1.SqsQueue(xJobImmediateQueue)],
    });
};
exports.createEventBridgeRules = createEventBridgeRules;
//# sourceMappingURL=createEventBridgeRules.js.map