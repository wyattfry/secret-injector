import test from 'node:test';
import assert from 'node:assert';
import SecretInjector from '../secretInjector.js';
  
test('synchronous passing test', (t) => {
    assert.equal(true, true);
});

const mockVaultReader = {
    getSecret: async (secretName) => {
        await new Promise()
        return 'secret-value'
    }
}

const settings = {
    "ConnectionStrings": {
        "SqlServer": "kv-secret-goes-here",
        "NotInKV": "wont-be-replaced"
    },
    "NonNestedKey": "plain old string"
}

test('Should format single key vault pair for keyvault', async (t) => {
    const sut = new SecretInjector(mockVaultReader, settings);
    sut._settings = {"a": "b"};
    const result = await sut.inject()
    assert.equal(result, "a");
});

test('Should format nested pair for keyvault', async (t) => {
    const sut = new SettingsReader();
    sut._settings = {
        "key1": {
            "key1.1": "value1.1"
        }
    };
    const result = await sut.injectSecrets()
    assert.equal(result, "key1--key1.1");
});

test('Should format multiple nested pairs for keyvault', async (t) => {
    const sut = new SettingsReader();
    sut._settings = {
        "key1": {
            "key1.1": "value1.1",
            "key1.2": "value1.1"
        }
    };

    const result = await sut.injectSecrets();
    const expect = [
        "key1--key1.1",
        "key1--key1.2"
    ]

    assert.deepStrictEqual(result, expect);
});

test('Should format example settings for keyvault', async (t) => {
    const sut = new SettingsReader('appsettings.example.json');
    await sut.read();

    const result = await sut.injectSecrets();
    const expect = [
        "ConnectionStrings--SqlServer",
        "ConnectionStrings--NotInKV",
        "NonNestedKey"
    ];

    assert.deepStrictEqual(result, expect);
});