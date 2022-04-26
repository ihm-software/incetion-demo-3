"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SSMClient_1 = require("@aws-sdk/client-ssm/dist-types/SSMClient");
const parameter_store_1 = require("../src/parameter-store");
jest.mock('@aws-sdk/client-ssm/');
const SSMClientMock = SSMClient_1.SSMClient;
const ssmClient = new SSMClientMock({});
describe('getEncryptedParameter', () => {
    beforeEach(() => {
        SSMClientMock.mockClear();
    });
    it('should call SSMClient with the correct parameters', async () => {
        const mockSSMResponse = { Value: 'fred' };
        SSMClientMock.prototype.send.mockImplementation(x => {
            console.log(x);
            return x.input === {} ? Promise.resolve(mockSSMResponse) : Promise.resolve(null);
        });
        const parameterStoreUtil = (0, parameter_store_1.getParameterStoreUtil)(ssmClient);
        const returnParameter = parameterStoreUtil.getEncryptedParameter('something');
        expect(SSMClient_1.SSMClient.prototype.send).toBeCalledTimes(1);
        expect(returnParameter).toBe('fred');
    });
});
//# sourceMappingURL=parameter-store.test.js.map