# Client Tools

## Install

Install Node.js

Execute
´´´
npm instal
´´´´

## Configure

Edit the file `config.json`. Current values:

```json
{
	"account": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
	"host": "http://localhost:4444"
}
```

The above configuration can be used with a local node, running in `regtest`.

## Usage

```js
var contracts = require('./lib/contracts');
var commands = require('./lib/commands');
```

## Setting the target host

To create a host variable referencing the target RSK node:

```js
var rskapi = require('rskapi');

// ....

var host = rskapi.host("http://localhost:4444");
```

Usually, the host entry point is defined in configuration:
```js
var config = require('./config.json');

var host = rskapi.host(config.host);
```

The protocol, host address and port should be specified.

## Commands

Each command is a function with a callback as the last argument. 

### Create an account

```js
commands.createAccount(host, function (err, address) { 
	if (err)
		console.log('error', err);
	else
		console.log('new account address', address);
}
```

The account is created in the target host. Its private key is saved into the node wallet.

### Unlock an account

```js
commands.unlockAccount(host, address, function (err, data) { 
	if (err)
		console.log('error', err);
}
```

The account is unlocked in the target host wallet. The unlock duration is 1 minute.

### Send and mine a transaction

```js
commands.processAccount(host, from, to, value, [options,] function (err, hash) { 
	if (err)
		console.log('error', err);
	else
		console.log('transaction hash', hash);
}
```
The arguments `from` and `to` are account addresses.

Usually, the options objects has additional data, example:

```js
{
	gas: 21000,
	gasPrice: 1,
	data: '0x .... '
}
```






