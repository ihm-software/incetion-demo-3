"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {getTokenUtil} from '../src/TokenUtil';
// eslint-disable-next-line node/no-unpublished-import
// import {decode} from 'jsonwebtoken';
const loglevel_1 = __importDefault(require("loglevel"));
// import {SSMClient} from '@aws-sdk/client-ssm/dist-types/SSMClient';
const log = loglevel_1.default.getLogger('runScheduledJob');
const level = loglevel_1.default.levels.DEBUG;
log.setLevel(level);
// const getEncryptedParameterMock = jest.fn(input => (input === {} ? {} : {}));
describe('getAuthToken', () => {
    beforeEach(() => { });
    it('should return a token', async () => {
        // const token = await getTokenUtil(ssmClient, log);
        // const decodedToken = decode(token, {complete: true, json: true});
        // expect(SSMClient.prototype.send).toBeCalledTimes(1);
        // expect(decodedToken).toBe(true);
    });
});
//# sourceMappingURL=getAuthToken.test.js.map