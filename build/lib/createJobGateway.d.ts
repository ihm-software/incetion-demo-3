import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { BranchedProps } from 'soundplus-cdk';
export declare type ApiGatewayProps = BranchedProps & {
    domainName: string;
    domainNameAliasHostedZoneId: string;
    domainNameAliasTarget: string;
};
export declare const createJobGateway: (scope: Construct, railsApiLambda: IFunction, props: ApiGatewayProps) => void;
