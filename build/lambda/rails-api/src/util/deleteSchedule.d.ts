export declare const deleteSchedule: (orgId: string, scheduleKey: string) => Promise<{
    statusCode: number;
    body: string;
} | undefined>;
