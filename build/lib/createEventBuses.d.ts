import { Construct } from 'constructs';
import { BranchedProps } from 'soundplus-cdk';
export declare type CreateEventBusProps = BranchedProps & {
    mongoTriggerEventBuses: MongoTrigger[];
};
export declare type MongoTrigger = {
    eventBusName: string;
    eventSourceName: string;
};
export declare const createEventBuses: (scope: Construct, props: CreateEventBusProps) => {
    envRegion: string | undefined;
    lambdas: string[];
    eventBuses: MongoTrigger[];
};
