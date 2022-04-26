import { Logger } from 'loglevel';
import { ParameterStoreUtil } from '../../util/src/parameter-store';
import { DynamoDBExecute } from './dataRepository';
import { TokenUtil } from './TokenUtil';
import { SecretsManagerUtil } from '../../util/src/secrets-manager';
export declare const runScheduledJob: (log: Logger, dynamoDB: DynamoDBExecute, parameterStoreUtil: ParameterStoreUtil, secretsManagerUtil: SecretsManagerUtil, tokenUtil: TokenUtil) => Promise<void>;
