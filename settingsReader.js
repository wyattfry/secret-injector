import { readFile } from 'node:fs/promises';

export default class SettingsReader {
    constructor(appsettingsFile) {
        this._appsettingsFile = appsettingsFile
    }
    async read() {
        const file = await readFile(this._appsettingsFile);
        this._settings = JSON.parse(file);
        return this._settings;
    }
    getSettings() {
        return this._settings;
    }
}