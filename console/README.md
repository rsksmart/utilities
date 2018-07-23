# RSK Node console

## Setup

Install [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/).

From the command line, execute `npm install` to install dependencies.

## Run

To run RSK console in the default host `http://localhost:4444` execute:

```shell
node console.js
```

To run RSK console in an specified host execute

```shell
node console.js -server HOST:PORT
```

To connect via _http_ is not necessary to specify the protocol. Run:

```shell
node console.js -server "mynode.com"
```

To connect via _https_ is necessary to specify the protocol. Run:

```shell
node console.js -server "https://public-node.rsk.co"
```

Default port is 4444. To connect to any other port you must specify it. For example:
```shell
node console.js -server "https://public-node.rsk.co:443"
```

If everything works as expected, the RSK command prompt will be displayed.

## Interact

There are several commands to interact with the node. These are a couple of examples:

web3.eth.blockNumber: returns the local blockchain's best block number.

web3.eth.getBalance(<ACCOUNT ADDRESS>): returns the account balance.

For more information about Web3 check the [documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API)
