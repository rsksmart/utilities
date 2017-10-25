# Test Commands and Samples

## Install

Install [Node.js](https://nodejs.org/en/). The code was developed and tested using NodeJS 6.x.x.

Execute
```
npm instal
```

## Configure

Edit the file `config.json`. Current values:
```json
{
    "account": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
    "host": "http://localhost:4444"
}
```

The above configuration can be used with a local node, running in `regtest`.

## Sample programs

### Samples Configuration

The samples shares a common `config.json`:

```js
{
    "account": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
    "host": "http://localhost:4444"
}
```

The account address should have enough balance and the node should sign transactions. Internally, the library
is using `eth_sendTransaction`.

### Counter Stressing

It compiles a contract, deploy a instance to a node, and invokes a transaction incrementing a counter.

Run:

```js
node [-h|--host <hostaddress>] [-c|--count <count>] [-f|--from <accountaddress>]
```

where:

- `-h`, `--host`: the host address (RPC entry point) to use. Default `config.host`.
- `-f`, `--from`: the account that creates the contract and invoke the method. Default `config.account`.
- `-c`, `--count`: number of transactions to send to contract method. Default `10`.

Expected output:
```
compiling contract counter.sol:counter
transaction 0x6e620af32eb8dc89bd77ae62200a0644ca44f14e9329712c3e03f2a2d8827069
contract mined in block 1543
contract address 0x99c4143e471d28df187a817940ed8cd8cc82c504
new contract 0x99c4143e471d28df187a817940ed8cd8cc82c504
value 1
transaction 0xfbe7b4f011a9e9aa51221e3913fecc6335c699f697af91fc34fb4c5d5cd0a2b6
transaction mined in block 1545
value 11
transaction 0x459b385cb50f6e255d547273fe0b4d0efbc9694a9fe8c15416e22adc761740d1
transaction mined in block 1546
value 21
transaction 0x5c178059e0662b143bd7ab9a96732f28bd95f10c8fe0968a5fed1c9b8066e7af
transaction mined in block 1548
....
```
	
### Process n transactions

Execute
```
node processtxs
```

It creates a new account, and sends ten transactions from `config.account` to the newly created account.

Specifying the number of transactions:
```
node processtxs --count 100
```

### Send n transactions without waiting for mining

Execute
```
node sendtxs
```

It creates a new account, and sends ten transactions from `config.account` to the newly created account,
without waiting for their mining.

Specifying the number of transactions:
```
node sendtxs --count 100
```

## Library Usage

In your program:
```js
var contracts = require('./lib/contracts');
var commands = require('./lib/commands');
```

### Setting the target host

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

### Get account balance
```js
commands.getBalance(host, address, function (err, balance) { 
    if (err)
        console.log('error', err);
    else
        console.log('account', address, 'balance', balance);
}
```
The balance is returned as an hexadecimal string. If it is small enought, 
it can be converted using `parseInt(balance, 16)`.

### Send and mine a transaction
```js
commands.processTransaction(host, from, to, value, [options,] function (err, hash) { 
    if (err)
        console.log('error', err);
    else
        console.log('transaction hash', hash);
}
```

The command sends value from a sender to a receiver, and wait for its mining. An error is returned if the
send fails or if the transaction is not mined. If the command success, 
the hash of the created transaction is returned.

The arguments `from` and `to` are account addresses.

Usually, the options objects has additional data, example:
```js
{
    gas: 21000,
    gasPrice: 1,
    data: '0x .... '
}
```

### Compile a Solidity program
```js
var contracts = require('./lib/contracts');

contract = contracts.compile('greeter.sol:greeter', 'greeter.sol');
```

The first argument is the qualified contract name. The second argument is the filename where the source code resides.

### Creating a contract instance

After compiling the contract, its bytecodes could be send to the network:

```js
commands.createContract(host, from, 0, contract.bytecode, function (err, address) { ... });
```

The callback function receives the address of the created instance.

### Invoking a contract method

A transaction is send to the contract using the `processTransaction` function:
```js
commands.processTransaction(host, from, contractAddress, 0, {
    gas: 1000000, 
    data: contracts.encodeCall(contract, 
        'setMessage(string)',   // function signature
        [ 'Hello, world' ])  // and arguments
}, next);
```

The `data` contains the encoded function signature and arguments. Currently, integers and string arguments
are supported.

If the function signature is unknown, it can be obtained using:

```js
contract = contracts.compile('greeter.sol:greeter', 'greeter.sol');

console.dir(contract.functionHashes);
```

### Calling a contract method

Instead of an online transaction, a call could be invoked:

```js
commands.callTransaction(host, fromfrom, contractAddress, 0, { data: 
    contracts.encodeCall(contract, 'getMessage()', []) }, 
    next);
```

A call cannot alter the contract storage.

### Chaining of commands

In the samples, the command callbacks are chaining using an asynchronous simple module.

Example:
```js
async()
    .exec(function (next) {
        commands.createAccount(host, next);
    })
    .then(function (data, next) {
        account1 = data;
        console.log('new account', account1);
        commands.createAccount(host, next);
    })
    .then(function (data, next) {
        account2 = data;
        console.log('new account', account2);
        commands.processTransaction(host, argv.from, account1, 100000, next);
    })
    .then(function (data, next) {
        commands.getBalance(host, account1, next);
    })
    .then(function (data, next) {
        console.log('account balance', account1, parseInt(data, 16));
    })
    .error(function (err) {
        console.log(err);
    });
```

## To do

These commands could be refactored to:

- Use node.js 8.x util.promisify (to convert the functions that use callbacks to return promises)
- Use async/await to call them

Current implementation is simple, and the uses cases didn't need those refactors, yet.

Currently, there is no support for sending a raw transaction.

