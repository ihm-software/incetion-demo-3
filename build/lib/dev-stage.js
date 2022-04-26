"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevStage = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const job_refactor_stack_1 = require("./job-refactor-stack");
const soundplus_cdk_1 = require("soundplus-cdk");
class DevStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        (0, soundplus_cdk_1.createWithId)(job_refactor_stack_1.JobRefactorStack, this, 'JobRefactorStack', props);
    }
}
exports.DevStage = DevStage;
//# sourceMappingURL=dev-stage.js.map