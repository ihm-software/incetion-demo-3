export declare const deleteJob: (orgId: string, jobkey: string) => Promise<{
    statusCode: number;
    body: string;
} | undefined>;
