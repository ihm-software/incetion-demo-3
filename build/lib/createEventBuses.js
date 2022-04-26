"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventBuses = void 0;
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const soundplus_cdk_1 = require("soundplus-cdk");
const soundplus_cdk_2 = require("soundplus-cdk");
const getLambdaPath_1 = require("../lambda/util/src/getLambdaPath");
const createEventBuses = (scope, props) => {
    var _a;
    const lambdas = [];
    const eventBuses = props.mongoTriggerEventBuses.map(x => x);
    props.mongoTriggerEventBuses.forEach(busProp => {
        var _a;
        const { eventBusName, eventSourceName } = busProp;
        const bus = (0, soundplus_cdk_1.createWithId)(aws_events_1.EventBus, scope, eventBusName + 'JobDataReplicate', props, {
            eventSourceName,
        });
        const lambdaHandler = (0, soundplus_cdk_2.createLambda)(scope, eventBusName, (0, getLambdaPath_1.getAbsoluteLambdaPath)(eventBusName));
        lambdaHandler.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: ['ssm:GetParameters', 'ssm:GetParametersByPath', 'sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
            resources: ['*'],
        }));
        lambdas.push(lambdaHandler.functionName);
        const rule = (0, soundplus_cdk_1.createWithId)(aws_events_1.Rule, scope, 'JobDataReplicate' + `${eventBusName}-rule`, props, {
            description: eventBusName + 'JobDataReplicate',
            enabled: true,
            eventBus: bus,
            eventPattern: {
                account: [(_a = props.env) === null || _a === void 0 ? void 0 : _a.account],
            },
            ruleName: eventBusName + 'JobDataReplicate',
            targets: [new aws_events_targets_1.LambdaFunction(lambdaHandler)],
        });
        lambdaHandler.grantInvoke(new aws_iam_1.ServicePrincipal('events.amazonaws.com', {
            conditions: {
                ArnLike: {
                    'aws:SourceArn': rule.ruleArn,
                },
            },
        }));
    });
    const envRegion = (_a = props.env) === null || _a === void 0 ? void 0 : _a.region;
    return { envRegion, lambdas, eventBuses };
};
exports.createEventBuses = createEventBuses;
//# sourceMappingURL=createEventBuses.js.map