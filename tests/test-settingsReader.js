import test from 'node:test';
import assert from 'node:assert';
import SettingsReader from '../settingsReader.js';

test('Should read settings', async (t) => {
    const sut = new SettingsReader('appsettings.example.json');
    const result = await sut.read();
    assert.equal(result.ConnectionStrings.SqlServer, "kv-secret-goes-here");
});