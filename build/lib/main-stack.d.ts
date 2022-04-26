import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { InfraRailsAppProps } from '../bin/app';
export declare class MainStack extends Stack {
    constructor(scope: Construct, id: string, props: InfraRailsAppProps);
}
