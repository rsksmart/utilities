# Explorer

## Install

Install [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/)

From the command line, execute `npm install` to install dependencies.

## Configure

Edit `config.json`:

```json
{
    "host": "<host:port>",
    "contract": {
        "name": "token",
        "source": "token.solc"
    },
    "accounts": [
        {
            "name": "<Account name>",
            "publicKey": "<account paddress>"
        }
    ],
    "btcaccounts": [
        {
            "name": "BTC Account",
            "bridgeData": "<data>"
        }
    ]    
}

```

Change `host` value to your node RPC entry point, ie `localhost:4444`.

## Run

From the command line, execute `npm start`

It should be accesed to http://localhost:3000

