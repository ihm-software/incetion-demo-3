"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_types_1 = require("@aws-sdk/client-secrets-manager/dist-types/");
const secrets_manager_1 = require("../src/secrets-manager");
jest.mock('@aws-sdk/secrets-manager-client/');
const SMClientMock = dist_types_1.SecretsManagerClient;
const smClient = new SMClientMock({});
describe('getSecret', () => {
    beforeEach(() => {
        SMClientMock.mockClear();
    });
    it('should call SSMClient with the correct parameters', async () => {
        const mockSMResponse = { Value: 'fred' };
        SMClientMock.prototype.send.mockImplementation(x => {
            console.log(x);
            return x.input === {} ? Promise.resolve(mockSMResponse) : Promise.resolve(null);
        });
        const secretsManagerUtil = (0, secrets_manager_1.getSecretsManagerUtil)(smClient);
        const returnSecret = secretsManagerUtil.getSecret('something');
        expect(dist_types_1.SecretsManagerClient.prototype.send).toBeCalledTimes(1);
        expect(returnSecret).toBe('fred');
    });
});
//# sourceMappingURL=secrets-manager.test.js.map