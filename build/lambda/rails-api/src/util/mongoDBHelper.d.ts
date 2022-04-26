import { ObjectID, Db } from 'mongodb';
import { ConsulResponse } from './Utils';
export declare const getKeyValueFromConsul: (keyName: string | undefined, overrideConsulEndpoint?: string | undefined, defaultValue?: string | undefined) => Promise<ConsulResponse>;
export declare const init: () => Promise<() => Promise<any>>;
export declare const getConnection: (context?: any, _waitForEventLoop?: boolean, poolSize?: number) => Promise<Db>;
export declare const releaseConnection: () => Promise<any>;
export declare const generateUpdateObject: (entityObj: any, ignoreFields: any, replaceFields?: any) => any;
export declare const generateObjectID: () => ObjectID;
