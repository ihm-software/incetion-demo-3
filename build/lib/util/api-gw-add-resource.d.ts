import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
export declare const addResource: (scope: Construct, gateway: LambdaRestApi) => Promise<void>;
