import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
export declare const createEventBridgeRules: (scope: Construct, xJobScheduleQueue: IQueue, xJobImmediateQueue: IQueue, runScheduledJobLambda: IFunction) => void;
