#!/usr/bin/env node

import Main from './main.js'

const usage = `Usage: secret-injector <appsettings_file> <key_vault_subdomain>

Read the given dotnet-style appsettings.json file, replacing the values for any Secret
found in the given Azure Key Vault with a matching name.

Example: the following appsettings file

    {
        "ConnectionStrings": {
            "SqlServer": "kv-secret-goes-here",
            "NotInKV": "wont-be-replaced"
        }
    }

Would become

    {
        "ConnectionStrings": {
            "SqlServer": "Server=tcp:example.database.windows.net,1433;Initial Catalog=example...",
            "NotInKV": "wont-be-replaced"
        }
    }
`;

if (process.argv[2] === '-h' || process.argv[2] === '--help') {
    console.error(usage);
    process.exit()
}

const m = new Main(process.argv[2], process.argv[3]);

await m.run();
