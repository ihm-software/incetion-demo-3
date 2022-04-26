import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfraRailsConfig } from '../bin/app';
export declare class JobRefactorStack extends Stack {
    constructor(scope: Construct, id: string, props: InfraRailsConfig);
}
