import test from 'node:test';
import assert from 'node:assert';
import VaultReader from '../vaultReader.js';

class MockSecretClient {
    async getSecret() {
        await new Promise();
        return {value: "IM A SECRET"};
    }
}

const mockClient = new MockSecretClient();
  
test('Should format single key vault pair for keyvault', async (t) => {
    const sut = new VaultReader(mockClient);
    const result = await sut.getSecret('secret--name');
    const expect = 'IM A SECRET'
    assert.equal(result, expect);
});