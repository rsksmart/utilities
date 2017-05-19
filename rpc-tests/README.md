# Integration Tests

Many of these tests were created to be used from a simple test framework.

## Setup

Install dependencies
```
    npm install
```

## Run integration test

Execute
```
    node runtest <spec>.json
```

Examples
```
    node runtest greeter.json
```

Each `.json` file defines the test steps. The steps are described below.

The steps run againts a node, using JSON RPC. The default address to use is `localhost:4444`.

Alternatively, you can specify the node to use using the `-server` command line option
```
    node runtest greeter.json -server localhost:4445
```

A typical `.json` file, `greeter.json`:

```json
    {
        "steps": [
            {
                "type": "contract",
                "source": "greeter.solc",
                "name": "greeter"
            },
            
            {
                "type": "call",
                "contract": "greeter",
                "method": "greet",
                "arguments": [],
                "expected": "Hello, Contract"
            }
        ]
    }
```

## Steps

A step is specified as an item in an array in the `.json` file. The array is named `steps`. Each step has a type 
and other parameteres.

In any step, description, comment or message can be specified, ie:
```json
    {
        "type": "account",
        "variable": "account1",
        "comment": "creating an account",
        "description": "this account is used in transfer steps",
        "message": "creating transfer target account..."
    }
```

Usually, the `message` value is added to the test standard output.


### Create Account

Its type is `account`. Example:
```json
    {
        "type": "account",
        "variable": "account1"
    }
```

It creates a random public key account, to be references in other steps by the variable name `account1`.

### Create Contract

Its type is `contract`. Example:
```json
    {
        "type": "contract",
        "source": "token.solc",
        "name": "token"
    }
```

It compiles the contract source code from file `token.solc`, creates the contract, waits for the contract transaction to be
mined, and retrieves the contract address. Creates a contract instance that can be references if other steps by name `token`.
The name should be the name of the contract in the source code.

### Create Contract using Events

Its type is `contractx`. Example:
```json
    {
        "type": "contractx",
        "source": "token.solc",
        "name": "token"
    }
```

It functions is similar to the previous one, `contract`, but it uses events to know when the
contract is mined.
It compiles the contract source code from file `token.solc`, creates the contract, waits for the contract transaction to be
mined, and retrieves the contract address. Creates a contract instance that can be references if other steps by name `token`.
The name should be the name of the contract in the source code.

### Transfer Ether

Its type is `transfer`. Example:
```json
    {
        "type": "transfer",
        "to": "0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d",
        "value": 5,
        "variable": "transfer1"
    }
```

You also can speficy:
- `from`: from account public key. Default value: `'0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'`. This is the public
key of one of the accounts into node wallet, so it can be used as source account for transfer.
- `gasPrice`: default value: 1
- `gasLimit`: default value: 21000

The `variable` property is optional, and it saves the hash value of the transfer transaction. It can be used in other 
steps, like the transaction step.

The `to` public key account can be obtained from a created account, example:
```json
    {
        "type": "account",
        "variable": "account1"
    },
    
    {
        "type": "transfer",
        "to": "account1",
        "value": 5,
        "variable": "transfer1"
    }
```

### Get Balance

Its type is `balance`. Example:
```json
    {
        "type": "balance",
        "account": "account1",
        "expected": 5
    }
```

The `account` property can be specified by public key, or by a named variable cointaining the account public key.

### Call Contract Non-Transactional Method

Its type is `call`. Example:
```json
    {
        "type": "call",
        "contract": "greeter",
        "method": "greet",
        "arguments": [],
        "expected": "Hello, Contract"
    }
```

Internally, there is no transaction. The result is returned immediately.

You can use arguments, like in the retrieve of public variables in `token` contract:
```json
    {
        "type": "call",
        "contract": "token",
        "method": "coinBalanceOf",
        "arguments": ["0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d"],
        "expected": 1000
    }
```

You can use variable names in the arguments. ie:
```json
    {
        "type": "call",
        "contract": "token",
        "method": "coinBalanceOf",
        "arguments": ["account1"],
        "expected": 1000
    }
```

### Invoke Transactional Method

Its type is `invoke`. Example:
```json
    {
        "type": "invoke",
        "contract": "token",
        "method": "sendCoin",
        "arguments": ["0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d", 1000],
        "from": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
    }
```

You also can speficy:
- `from`: from account public key. Default value: `'0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'`. This is the public
key of one of the accounts into node wallet, so it can be used as source account for transfer.
- `gasPrice`: default value: 1
- `gasLimit`: default value: 1000000 (one million)

You can use variable names in the arguments. ie:
```json
    {
        "type": "invoke",
        "contract": "token",
        "method": "sendCoin",
        "arguments": ["0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d", "amount"],
        "from": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
    }
```

### Use Node

Usually, you specify the target node by command line argument, like:
```
    node runtest token.json -server localhost:4445
```

The use step can specified the node to use for the following steps. Its type is `use`. Example:
```json
    {
        "type": "use",
        "server": "localhost:4445"
    }
```
See below, at examples section, for a use case for use step (no pun intended ;-).

### Get Transaction Receipt

Sometimes, you need to check if a transaction was mined by a node. You need the original hash and the transfer step. Its
type is 'transaction`. Example:
```json
    {
        "type": "transaction",
        "hash": "contract1"
    }
```
Usually the hash is obtained from other step that created the transaction. See below, at examples section, for a sample
test using two nodes, checking the transaction created in one node having mined by the second node.


## Test Examples

Creating and invoking `greeter` contract:

```json
    {
        "steps": [
            {
                "type": "contract",
                "source": "token.solc",
                "name": "token"
            },
                    
            {
                "type": "call",
                "contract": "token",
                "method": "coinBalanceOf",
                "arguments": ["0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"],
                "expected": 10000
            },
            
            {
                "type": "invoke",
                "contract": "token",
                "method": "sendCoin",
                "arguments": ["0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d", 1000],
                "from": "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
            },
                    
            {
                "type": "call",
                "contract": "token",
                "method": "coinBalanceOf",
                "arguments": ["0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d"],
                "expected": 1000
            },
                    
            {
                "type": "call",
                "contract": "token",
                "method": "coinBalanceOf",
                "arguments": ["0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"],
                "expected": 9000
            }
        ]
    }
```

Creating an account, transfering ether and checking the balance:

```json
    {
        "steps": [
            {
                "type": "account",
                "variable": "account1"
            },
            
            {
                "type": "transfer",
                "to": "account1",
                "value": 5,
                "variable": "transfer1"
            },
            
            {
                "type": "balance",
                "account": "account1",
                "expected": 5
            },
                    
            {
                "type": "transaction",
                "hash": "transfer1"
            },
            
            {
                "type": "transfer",
                "to": "account1",
                "value": 10,
                "variable": "transfer2"
            },
            
            {
                "type": "balance",
                "account": "account1",
                "expected": 15
            }
        ]
    }
```

Creating a contract in one node, and verifying the creation contract transaction at another node:
```json
    {
        "steps": [
            {
                "type": "use",
                "server": "localhost:4445",
                "comment": "using a miner node"
            },
            
            {
                "type": "contract",
                "source": "token.solc",
                "name": "token",
                "variable": "contract1",
                "comment": "creating the contract, and saving the transaction hash in variable contract1"
            },
            
            {
                "type": "use",
                "server": "localhost:4444",
                "comment": "switch to a second node"
            },
                    
            {
                "type": "transaction",
                "hash": "contract1",
                "comment": "verifying the contract transaction is also in second node"
            }
        ]
    }
```


## Tests:

### addaccount.js
Adds an account to a local node.
Usage:
```
    node addaccount.js
```

### analyzebc.js
Check the blockchain and compares a range of blocks in given nodes.
Usage:
```
    node analyzebc.js HOST1:PORT HOST2:PORT START_BLOCK-FINISH_BLOCK
```
Example:
```
    node analyzebc.js localhost:4444 localhost:4445 localhost:4446 650-670
```

### contract1.js
Adds a contract to a local node.
Usage:
```
    node contract1.js
```

### contract2.js
Adds a contract to a local node.
Usage:
```
    node contract2.js
```

### createcontract.js
Creates a contract in a given node.
Usage:
```
    node createcontract.js -server HOST:PORT
```

### example.js

### filter.js
Checks if filters work for contract with a method that generates a log entry and for a contract with a method that calls another contract which generates a log entry in a local node.
Usage:
```
    node filter.js
```

### filter2.js
Starts a watcher in a local node.
Usage:
```
    node filter2.js
```

### getblock.js
Get the latest block from a local node.
Usage:
```
    node getblock.js
```

### getlogs.js

### greeter-peg.js

### greeter.js

Compile and mine the contract `greeter.js` using directly web3 library, no DSL.

The contract `greeter.solc` source code:
```
contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) suicide(owner); }
}

contract greeter is mortal {
    /* define variable greeting of the type string */
    string greeting;

    /* this runs when the contract is executed */
    function greeter() public {
        greeting = "Hello, Contract";
    }
    
    function setMessage(string g) {
        greeting = g;
    }

    /* main function */
    function greet() constant returns (string) {
        return greeting;
    }
}

```

### greeter2.js

Compile and mine the contract `greeter.js` using directly web3 library, no DSL. Additionally,
invokes its `setMessage` method.

### miningDistribution.js
Goes over the blockchain of a local node to check which block were mined by that node.
Usage:
```
    node miningDistribution.js
```

### peerCount3NodeLocalNet.js
Checks for the peer count on 3 local nodes.
Usage:
```
    node peerCount3NodeLocalNet.js
```

### sync2nodes.js
Checks for the hash of a block in 2 local nodes.
Usage: 
```
    node sync2nodes.js
```

### sync3nodes.js
Checks for the hash of a block in 3 local nodes.
Usage:
```
    node sync3nodes.js
```

### syncnnodes.js
Checks if given nodes are in syncro.
Usage: 
```
    node syncnnodes.js HOST1:PORT HOST2:PORT
```

### test_tps.js
Runs several tx betweeen accounts configured on test_tps.json in a configured time seted alson in test_tps.json.
Usage:
```
    node test_tps.js -file test_tps.json
```

### token.js

Mines and invoked a token contract. The token contract is already precompiled to Ethereum Virtual Machine
bytecodes.

### tokkenint.js

Simple program mining tokkenit contract (precompiled to EVM bytecodes)

### transactions.js

Sends 10 transactions using web3

### wing.js

Simple program mining `wings.sol`. The source code:

```
var Web3 = require('web3');
var fs = require('fs');

var server = "localhost:4444";

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://' + server));

var accounts = web3.eth.accounts;
web3.eth.defaultAccount = accounts[0];

console.log("Default account: ", web3.eth.defaultAccount);
console.log("Compiling");

var sourceCode = fs.readFileSync('./wings.sol', 'utf8');
var compiledContract = web3.eth.compile.solidity(sourceCode);

console.log("Definition");

setTimeout(function () {
  var WingsContract = web3.eth.contract(compiledContract.info.abiDefinition);
  console.log("Instance");
  WingsContract.abi = WingsContract.abi.functions;
  var wings = WingsContract.new({     
            from: "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
            data: compiledContract.code,    
            gasPrice: 1,     
            gas: 300000 
    }, function (err, c) {
        if (err)
            return console.log(err);
        
        console.log('contract', c);
        
        if (c && typeof c.address != 'undefined') {
            console.log('Contract mined! address: ' + c.address + ' transactionHash: ' + c.transactionHash);
            console.log('Transaction Nonce:' + web3.eth.getTransaction(c.transactionHash).nonce);
  			console.log('receiveTokens', c.recieveTokens({     
            from: "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
            gasPrice: 1,     
            gas: 300000 
    		}));            
        }
    });
  
}, 2000);
```
