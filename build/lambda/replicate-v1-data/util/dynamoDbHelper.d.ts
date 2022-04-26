import { RaptorJobDocument, RaptorJobScheduleDocument } from './types';
export declare const addOrUpdateData: (tableName: string, data: RaptorJobDocument | RaptorJobScheduleDocument) => Promise<boolean>;
export declare const deleteData: (tableName: string, previousData: Record<string, unknown>) => Promise<boolean>;
