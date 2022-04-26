/** Ported from
 * https://github.com/ihm-software/soundplus-jobs-run-scheduled/blob/master/handler.js
 */
import { EventBridgeHandler } from 'aws-lambda';
export declare const handler: EventBridgeHandler<'scheduled-job', {}, void>;
