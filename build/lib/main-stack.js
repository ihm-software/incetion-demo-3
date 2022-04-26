"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainStack = void 0;
const dev_stage_1 = require("./dev-stage");
const uat_stage_1 = require("./uat-stage");
const prod_stage_1 = require("./prod-stage");
const soundplus_cdk_1 = require("soundplus-cdk");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
class MainStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const pipeline = (0, soundplus_cdk_1.createPipeline)(this, id, { branch: props.branch, ghRepository: props.ghRepository });
        const devEnvironments = props.environments[soundplus_cdk_1.EnvironmentType.Dev];
        const dev = pipeline.addWave('dev');
        devEnvironments.forEach(environment => {
            dev.addStage((0, soundplus_cdk_1.createWithId)(dev_stage_1.DevStage, this, environment.name, { ...environment, ...{ branch: props.branch } }));
        });
        const staging = pipeline.addWave('uat');
        const stagingEnvironment = props.environments[soundplus_cdk_1.EnvironmentType.Uat];
        stagingEnvironment.forEach(environment => {
            const stage = (0, soundplus_cdk_1.createWithId)(uat_stage_1.UatStage, this, environment.name, { ...environment, ...{ branch: props.branch } });
            staging.addStage(stage).addPre(new pipelines_1.ManualApprovalStep('Release_To_Uat', { comment: 'Are you sure you want to release to Uat?' }));
        });
        const prod = pipeline.addWave('prod');
        const prodEnvironment = props.environments[soundplus_cdk_1.EnvironmentType.Prod];
        prodEnvironment.forEach(environment => {
            const stage = (0, soundplus_cdk_1.createWithId)(prod_stage_1.ProdStage, this, environment.name, { ...environment, ...{ branch: props.branch } });
            prod.addStage(stage).addPre(new pipelines_1.ManualApprovalStep('Release_To_Prod', { comment: 'Are you sure you want to release to Production?' }));
        });
        pipeline.buildPipeline();
        const topic = (0, soundplus_cdk_1.createWithId)(aws_sns_1.Topic, this, 'soundplus-jobs-gssync', props);
        const target = new aws_events_targets_1.SnsTopic(topic);
        pipeline.pipeline.onStateChange('soundplus-jobs-gssync-event').addTarget(target);
    }
}
exports.MainStack = MainStack;
//# sourceMappingURL=main-stack.js.map