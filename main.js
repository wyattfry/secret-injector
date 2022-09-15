import { writeFile } from 'node:fs/promises';
import { SecretClient } from "@azure/keyvault-secrets";
import { AzureCliCredential } from "@azure/identity";
import SettingsReader from "./settingsReader.js";
import VaultReader from "./vaultReader.js";
import SecretInjector from "./secretInjector.js";

class Main {
    constructor(appsettingsFile, vaultSubdomain) {
        if (appsettingsFile === undefined || vaultSubdomain === undefined) {
            throw 'Must provide an appsettingsFile and vaultSubdomain.'
        }
        this.appsettingsFile = appsettingsFile;
        this.vaultSubdomain = vaultSubdomain;
    }
    async run() {
        const sr = new SettingsReader(this.appsettingsFile);
        await sr.read();
        const settings = sr.getSettings();
        console.log(`Read settings from '${this.appsettingsFile}'`)

        const credentials = new AzureCliCredential();
        const vaultUrl = `https://${this.vaultSubdomain}.vault.azure.net`;
        const client = new SecretClient(vaultUrl, credentials);
        const vr = new VaultReader(client);
        
        const si = new SecretInjector(vr, settings);
        await si.inject();

        await writeFile(this.appsettingsFile, JSON.stringify(settings, null, 4));
    }
}

export default Main
