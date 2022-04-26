#!/usr/bin/env node
import 'source-map-support/register';
import { ApiGatewayProps } from '../lib/createJobGateway';
import { MainStackProps, EnvironmentConfigMap } from 'soundplus-cdk';
import { CreateEventBusProps } from '../lib/createEventBuses';
export declare type InfraRailsConfig = ApiGatewayProps & CreateEventBusProps;
export declare type InfraRailsAppProps = MainStackProps & {
    environments: EnvironmentConfigMap<InfraRailsConfig>;
};
