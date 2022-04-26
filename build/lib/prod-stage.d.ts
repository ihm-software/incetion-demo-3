import { Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfraRailsConfig } from '../bin/app';
export declare class ProdStage extends Stage {
    constructor(scope: Construct, id: string, props: InfraRailsConfig);
}
