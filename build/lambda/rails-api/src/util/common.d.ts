import { Db } from 'mongodb';
export declare const prepareRaptorJobScheduleObject: (raptorObj: any) => any;
export declare const getJobRequestObjectForJobType: (conn: Db, jobschedule: any) => Promise<any>;
export declare const getJobKey: (jobschedule: any) => Promise<string | null>;
