export declare const GetJobAsync: (orgId: string, jobKey: string) => Promise<{
    statusCode: number;
    body: string;
}>;
export declare const CreateJobAsync: (body: any) => Promise<{
    statusCode: number;
    body: string;
}>;
export declare const PutJobAsync: (body: any) => Promise<{
    statusCode: number;
    body: string;
}>;
export declare const PatchJobAsync: (body: any) => Promise<{
    statusCode: number;
    body: string;
}>;
export declare const AddOrUpdateJobAsync: (body: any) => Promise<{
    statusCode: number;
    body: string;
}>;
export declare const runJobAsync: (z_cloud_org_id: string, jobkey: string) => Promise<{
    statusCode: number;
    body: {};
}>;
export declare const getJobRequestObjectForJobType: (conn: any, jobschedule: any) => Promise<any>;
export declare const getJobKey: (jobschedule: any) => Promise<string | null>;
