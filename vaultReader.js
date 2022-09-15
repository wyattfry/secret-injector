class VaultReader {
    constructor(secretClient) {
        this.secretClient = secretClient;
    }
    async getSecret(secretName) {
        const result = await this.secretClient.getSecret(secretName);
        return result.value;
    }
}

export default VaultReader

// try {
//     await getSecret('qp-eastus-stg-kv', 'not-there')
// } catch (error) {
//     console.error('#### ERROR #####')
//     console.log(JSON.stringify(error.response.parsedBody.error.message, null, 2))
// }
//
// "Client address is not authorized and caller is not a trusted service.\r\nClient address: 24.47.181.152\r\nCaller: appid=04b07795-8ddb-461a-bbee-02f9e1bf7b46;oid=f0a3c915-6a60-45e0-afdf-7a7ade5311e1;iss=https://sts.windows.net/fefb8bdf-9eeb-4659-96e1-490e8d20b96e/\r\nVault: qp-eastus-stg-kv;location=eastus"

// "A secret with (name/id) not-there was not found in this key vault. If you recently deleted this secret you may be able to recover it using the correct recovery command. For help resolving this issue, please see https://go.microsoft.com/fwlink/?linkid=2125182"