
async function echoAsync(input) {
    return new Promise((resolve, _) => {
        resolve(input);
    })
}

function handleVaultReadError(error) {
    if (error.response && error.response.parsedBody.error.message.startsWith('Client address is not authorized')) {
        throw error;
    }
    const notFound = error.response && error.response.parsedBody.error.message.startsWith('A secret with (name/id) ');
    const invalidName = error.response && error.response.parsedBody.error.message.startsWith('The request URI contains an invalid name: ');
    if (notFound === false && invalidName === false) {
        // Some other kind of error
        throw error;
    }
}

class SecretInjector {
    constructor(vaultReader, appsettingsObject) {
        this.vaultReader = vaultReader;
        this._settings = appsettingsObject;
    }
    async inject() {
        const result = []
        let secretName;
        let secretValue;
        for (let k in this._settings) {
            if (typeof (this._settings[k]) === 'string') {
                secretName = k;
                try {
                    secretValue = await this.vaultReader.getSecret(secretName);
                    this._settings[k] = secretValue;
                    console.log(`Injected secret '${secretName}'`);
                    result.push(k)
                } catch (error) {
                    handleVaultReadError(error);
                }
            } else {
                for (let k2 in this._settings[k]) {
                    secretName = `${k}--${k2}`;
                    try {
                        secretValue = await this.vaultReader.getSecret(secretName);
                        this._settings[k][k2] = secretValue;
                        console.log(`Injected secret '${secretName}'`);
                        result.push(`${k}--${k2}`);
                    } catch (error) {
                        handleVaultReadError(error);
                    }
                }
            }
        }
        return result;
    }
}

export default SecretInjector;