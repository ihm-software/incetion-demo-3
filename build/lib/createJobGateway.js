"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobGateway = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const soundplus_cdk_1 = require("soundplus-cdk");
const soundplus_cdk_2 = require("soundplus-cdk");
const createJobGateway = (scope, railsApiLambda, props) => {
    const gateway = (0, soundplus_cdk_2.createApiGateway)(scope, 'jobAPIv2', { description: 'Endpoint for Job Refactor API V2' });
    const addUpdate = gateway.root.addResource('addorupdate');
    addUpdate.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const byJobType = gateway.root.addResource('byJobType');
    const jobType = byJobType.addResource('{jobtype}', { defaultMethodOptions: { operationName: 'jobtype' } });
    jobType.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.jobtype': true,
        },
    });
    const countolderthan = gateway.root.addResource('countolderthan');
    countolderthan.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const graphql = gateway.root.addResource('graphql');
    graphql.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const jobCountbyJobType = gateway.root.addResource('jobcountbyjobtype');
    const jobTypeCount = jobCountbyJobType.addResource('{jobtype}', { defaultMethodOptions: { operationName: 'jobtype' } });
    jobTypeCount.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.jobtype': true,
        },
    });
    const list = gateway.root.addResource('list');
    list.addMethod('DELETE', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    list.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const olderthan = gateway.root.addResource('olderthan');
    olderthan.addMethod('DELETE', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    olderthan.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const replayjob = gateway.root.addResource('replayjob');
    const replayjobkey = replayjob.addResource('{jobkey}', { defaultMethodOptions: { operationName: 'jobkey' } });
    replayjobkey.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.jobkey': true,
        },
    });
    const runjob = gateway.root.addResource('runjob');
    runjob.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const runjobkey = runjob.addResource('{jobkey}', { defaultMethodOptions: { operationName: 'jobkey' } });
    runjobkey.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.jobkey': true,
        },
    });
    const schedule = gateway.root.addResource('schedule');
    schedule.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const scheduleaddorupdate = schedule.addResource('addorupdate');
    scheduleaddorupdate.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const schedulegraphql = schedule.addResource('graphql');
    schedulegraphql.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }));
    const schedulejobinstance = schedule.addResource('jobinstance');
    const schedulekey = schedulejobinstance.addResource('{schedulekey}', { defaultMethodOptions: { operationName: 'schedulekey' } });
    schedulekey.addMethod('POST', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.schedulekey': true,
        },
    });
    const schedulekeyroot = schedule.addResource('{schedulekey}', { defaultMethodOptions: { operationName: 'schedulekey' } });
    schedulekeyroot.addMethod('DELETE', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.schedulekey': true,
        },
    });
    schedulekeyroot.addMethod('GET', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.schedulekey': true,
        },
    });
    schedulekeyroot.addMethod('PATCH', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.schedulekey': true,
        },
    });
    schedulekeyroot.addMethod('PUT', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.schedulekey': true,
        },
    });
    const rootjobkey = gateway.root.addResource('{jobkey}', { defaultMethodOptions: { operationName: 'jobkey' } });
    rootjobkey.addMethod('DELETE', new aws_apigateway_1.LambdaIntegration(railsApiLambda, { proxy: true }), {
        requestParameters: {
            'method.request.querystring.jobkey': true,
        },
    });
    /* rootjobkey.addMethod('GET', new LambdaIntegration(jobFunctionsLambda, {proxy: true}), {
            requestParameters: {
                'method.request.querystring.jobkey': true,
            },
        });
        rootjobkey.addMethod('PATCH', new LambdaIntegration(jobFunctionsLambda, {proxy: true}), {
            requestParameters: {
                'method.request.querystring.jobkey': true,
            },
        });
        rootjobkey.addMethod('PUT', new LambdaIntegration(jobFunctionsLambda, {proxy: true}), {
            requestParameters: {
                'method.request.querystring.jobkey': true,
            },
        }); */
    const domain = aws_apigateway_1.DomainName.fromDomainNameAttributes(scope, props.domainName, {
        domainName: props.domainName,
        domainNameAliasHostedZoneId: props.domainNameAliasHostedZoneId,
        domainNameAliasTarget: props.domainNameAliasTarget,
    });
    new aws_apigateway_1.BasePathMapping(scope, `mapping${props.branch}`, {
        domainName: domain,
        restApi: gateway,
        basePath: (0, soundplus_cdk_1.nameFromBranch)('jobv2', props.branch),
    });
};
exports.createJobGateway = createJobGateway;
//# sourceMappingURL=createJobGateway.js.map