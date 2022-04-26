import { EventBridgeEvent } from 'aws-lambda';
import { EventBridgeDetail } from './util/types';
export declare const jobDataReplicateHandler: (event: EventBridgeEvent<string, EventBridgeDetail>) => Promise<boolean>;
