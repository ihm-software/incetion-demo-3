import { RaptorJobDocument, RaptorJobScheduleDocument, Document } from './types';
export declare const transform: (tableName: string, updatedData: Document) => Promise<RaptorJobDocument | RaptorJobScheduleDocument>;
