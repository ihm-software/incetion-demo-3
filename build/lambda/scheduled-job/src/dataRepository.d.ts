import { ExecuteStatementCommandInput, ExecuteStatementCommandOutput, ExecuteTransactionCommandInput, ExecuteTransactionCommandOutput } from '@aws-sdk/client-dynamodb';
import { HttpHandlerOptions } from '@aws-sdk/types';
import { Logger } from 'loglevel';
export declare type DynamoDBExecute = {
    executeStatement(args: ExecuteStatementCommandInput, options?: HttpHandlerOptions): Promise<ExecuteStatementCommandOutput>;
    executeTransaction(args: ExecuteTransactionCommandInput, options?: HttpHandlerOptions): Promise<ExecuteTransactionCommandOutput>;
};
/** end creating some nonsense here to get compiled */
/**
 * Set the NextRunDateTime for any JobSchedule items for which it is not set (usually newly created)!
 */
export declare const setNextRunDateTimeForNewJobSchedules: (log: Logger, dynamoDB: DynamoDBExecute) => Promise<void>;
/**
 * Get jobSchedule entries for which we should schedule jobs
 * note that for now the EndDateTie and the MaxCount are not used - strip them out of the query for now.
 * @param utcNow the NextRunDateTime : String
 * @returns Promise<any>
 */
export declare const getDueSchedules: (utcNow: string, log: Logger, dynamoDB: DynamoDBExecute) => Promise<ExecuteStatementCommandOutput | null>;
/** Unused
 * THIS STATEMENT IS NOT WORKING DUE TO CURRENT LIMITATIONS IN DYNAMODB! LEFT FOR FUTURE REFERENCE
 * Cannot select from indexes in transactions, but cannot do EXISTS in statement (must be transaction), also the WHERE clause must include the primary key...
 * get jobSchedule entries for which we should schedule jobs
 * note that for now the EndDateTie and the MaxCount are not used - strip them out of the query for now.
 */
export declare const getDueSchedulesTransaction: (utcNow: string, log: Logger, dynamoDB: DynamoDBExecute) => Promise<{
    [key: string]: import("@aws-sdk/client-dynamodb").AttributeValue;
} | null | undefined>;
/**
 * Get the active Jobs
 * @param scheduleKey String
 * @returns
 */
export declare const getActiveJobsWithScheduleKey: (scheduleKey: string, log: Logger, dynamoDB: DynamoDBExecute) => Promise<ExecuteStatementCommandOutput | null>;
