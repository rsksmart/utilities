var Web3 = require('web3');


var fs = require('fs');
var solc = require('solc');

var web3;

var nunexpected = 0;

var testname = process.argv[2];

var contracts = {};
var server = "localhost:4444";
var variables = {};

var test = require('./' + testname);

getInputParamsFromCommandLineIfAny();

function getVariable(arg) {
	console.log("get variable", arg);
	
	if (arg == null)
		return null;
	
	if (typeof arg == 'string' && arg[0] == '=') {
		console.log("evaluating", arg.substring(1));
		with (variables) 
			return eval(arg.substring(1));
	}
			
	if (variables[arg])
		return variables[arg];
	
	return arg;
}

function getVariables(args) {
	if (!args || !args.length)
		return [];
	
	var result = [];
	
	args.forEach(function (arg) {
		result.push(getVariable(arg));
	});
	
	return result;
}

function findImports(path) {
	console.log('Import', path);
	return { contents: fs.readFileSync('./' + path).toString() };
    // return { error: 'File not found' }
}

function compileContract(filename, name) {
    console.log('compiling contract', filename);
    var input = fs.readFileSync(filename).toString();
	var sources = {};
	sources[filename] = input;
    var output = solc.compile({ sources: sources }, 1, findImports); // 1 activates the optimiser

    var result = {
        code: output.contracts[name].bytecode,
        abi: JSON.parse(output.contracts[name].interface)
    };
    
    console.log('code', result.code);
    console.log('abi', JSON.stringify(result.abi));
    
    return result;
}

function generateByte() {
    var value = Math.floor(Math.random() * 256).toString(16);
    
    if (value.length < 2)
        value = '0' + value;
    
    return value;
}

function generateAccountKey() {
    var key = '0x';
    
    for (var k = 0; k < 20; k++)
        key += generateByte();
    
    return key;
}

function processVariable(variable, value) {
    if (variable)
        variables[variable] = value;
}

function processExpected(expected, value) {
    if (expected == null)
        return;

	expected = getVariable(expected);
    
    if (expected != value)
        console.log('expected', expected, 'but received', value);
    else
        console.log('received expected value', value);
}

function getResultValue(result) {
    if (typeof result !== 'object')
        return result;
    
    if (typeof result.toNumber === 'function')
        return result.toNumber();
    
    if (result.c && Array.isArray(result.c))
        return result.c[0];
    
    return result;
}

var ntriestx = 0;

function getTransactionReceiptStep(hash, cb) {
	ntriestx++;
	
	if (ntriestx >= 60)
		return cb(new Error("transaction was not mined"), null);
	
	try {
		var transaction = web3.eth.getTransactionReceipt(hash);
	}
	catch (ex) {
		return cb(ex, null);
	}
    
    if (transaction)
        console.dir(transaction);
    else
        console.log('waiting for transaction');
    
    if (transaction)
        cb(null, transaction);
    else
        setTimeout(function () {
            getTransactionReceiptStep(hash, cb);
        }, 1000);    
}

function getTransactionReceipt(hash, cb) {
	ntriestx = 0;
	
	getTransactionReceiptStep(hash, cb)
}

function getContractAddress(hash, cb) {
    getTransactionReceipt(hash, function (err, transaction) {
        if (err)
            return cb(err, null);
        
        if (!transaction)
            return cb('contract transaction not found', null);

        console.log('contract address', transaction.contractAddress);
        
        cb(null, transaction.contractAddress);
    });
}

function getWeb3() {
    if (web3)
        return web3;

    console.log('using web3', server);
    web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://' + server));

	web3._extend({
		property: 'personal',
		methods: [new web3._extend.Method({
			name: 'sendTransaction',
			call: 'personal_sendTransaction',
			params: 2,
			inputFormatter: [web3._extend.formatters.inputCallFormatter, function (value) { return value; }],
			outputFormatter: null
		})]
	});
	
	console.log(web3.personal.sendTransaction.toString());

    return web3;
}

function executeAccount(cmd, cb) {
    var msg = cmd.msg || "account...";
    console.log(msg);    
    
    var key = generateAccountKey();
    
    console.log('new account public key', key);
    
    processVariable(cmd.variable, key);
    
    cb(null, key);
}

function executePersonalAccount(cmd, cb) {
    var msg = cmd.msg || "personal account...";
    console.log(msg);    

	var web3 = getWeb3();
	
	var key = web3.personal.newAccount(cmd.passphrase ? cmd.passphrase : 'passphrase');
    
    console.log('new personal account public key', key);
    
    processVariable(cmd.variable, key);
    
    cb(null, key);
}

function executeTransfer(cmd, cb) {
    var msg = cmd.msg || "transfer...";
    console.log(msg);    
    
    getWeb3();
    
    var result = web3.eth.sendTransaction({     
        from: getVariable(cmd.from) || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
        to: getVariable(cmd.to),
        value: cmd.value,
        gasPrice: cmd.gasPrice || 1,     
        gas: cmd.gas || 90000 });

    console.log('transaction hash', result);

    processVariable(cmd.variable, result);    

    getTransactionReceipt(result, function (err, data) {
		if (err)
			return cb(err, data);
		
		processVariable(cmd.variable + "_block", "0x" + Number(data.blockNumber).toString(16));
		
		cb(err, data);
	});
}

function executePersonalTransfer(cmd, cb) {
    var msg = cmd.msg || "personal transfer...";
    console.log(msg);    
    
    getWeb3();
	
    var result = web3.personal.sendTransaction({     
        from: getVariable(cmd.from) || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
        to: getVariable(cmd.to),
        value: cmd.value,
        gasPrice: cmd.gasPrice || 1,     
        gas: cmd.gas || 90000 }, "passphrase");

    console.log('transaction hash', result);

    processVariable(cmd.variable, result);    

    getTransactionReceipt(result, function (err, data) {
		if (err)
			return cb(err, data);
		
		processVariable(cmd.variable + "_block", "0x" + Number(data.blockNumber).toString(16));
		
		cb(err, data);
	});
}

function executeUse(cmd, cb) {
    var msg = cmd.msg || "use...";
    console.log(msg);
    
    web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://' + cmd.server));
    console.log('node at', cmd.server);
    
    cb(null, null);
}

function executeTransaction(cmd, cb) {
    var msg = cmd.message || "get transaction...";
    console.log(msg);
    
    getWeb3();
   
    getTransactionReceipt(getVariable(cmd.hash), cb);
}

function executeBalance(cmd, cb) {
    var msg = cmd.message || "get balance...";
    console.log(msg);
    
    getWeb3();

	if (cmd.block)
		var result = web3.eth.getBalance(getVariable(cmd.account), getVariable(cmd.block));    
	else
		var result = web3.eth.getBalance(getVariable(cmd.account));    
	
    var balance = getResultValue(result);
    
    console.log('balance', balance);
    
    processVariable(cmd.variable, balance);
    processExpected(cmd.expected, balance);
    
    cb(null, balance);
}

function defineContract(cmd, cb) {
    var msg = cmd.message || "define contract...";
    console.log(msg);
    
    getWeb3();

	var contractDefinition = web3.eth.contract(cmd.abi);

	var contract = contractDefinition.at(cmd.address);
	processVariable(cmd.name, cmd.address);
	
	contracts[cmd.name] = contract;
	
	cb(null, null);
}

function executeContract(cmd, cb) {
    var msg = cmd.message || "new contract...";
    console.log(msg);
    
    getWeb3();
    
    var code;
    var abi;
    
    if (cmd.source) {
        var compiled = compileContract(cmd.source, cmd.name);
        
        code = compiled.code;
        abi = compiled.abi;
    }
    else {
        code = cmd.code;
        abi = cmd.abi;
    }
        
    
    var result = web3.eth.sendTransaction({     
        from: cmd.from || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
		value: cmd.value || 0,
        data: code,    
        gasPrice: cmd.gasPrice || 1,     
        gas: cmd.gas || 300000 });

    console.log('transaction hash', result);

    processVariable(cmd.variable, result);
    
    getContractAddress(result, function (err, address) {
        if (err)
            return cb(err, null);
        
        var contractDefinition = web3.eth.contract(abi);
    
        var contract = contractDefinition.at(address);
		processVariable(cmd.name, address);
        
        contracts[cmd.name] = contract;
        
        cb(null, null);
    });
}

function executeContractEx(cmd, cb) {
    var msg = cmd.message || "new contract using events...";
    console.log(msg);
    
    getWeb3();
    
    var code;
    var abi;
    
    if (cmd.source) {
        var compiled = compileContract(cmd.source, cmd.name);
        
        code = compiled.code;
        abi = compiled.abi;
    }
    else {
        code = cmd.code;
        abi = cmd.abi;
    }
    
    var contract = web3.eth.contract(abi);
    
    var args = cmd.arguments || [];
	args = getVariables(args);
    
    args.push({     
            from: cmd.from || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
			value: cmd.value || 0,
            data: code,    
            gasPrice: cmd.gasPrice || 1,     
            gas: cmd.gas || 300000 
    });
    
    args.push(function (err, c) {
        if (err)
            return cb(err, null);
        
        console.log('contract', c);
        
        if (c && typeof c.address != 'undefined') {
            console.log('Contract mined! address: ' + c.address + ' transactionHash: ' + c.transactionHash);
            contracts[cmd.name] = c;
			processVariable(cmd.name, c.address);
        
            cb(null, null);
        }
    });
   
    contract.new.apply(contract, args);
}

function executeCall(cmd, cb) {
    var msg = cmd.message || "call...";
    console.log(msg);
        
    getWeb3();
    
    var contract = contracts[cmd.contract];
    
    var args = cmd.arguments.slice();
    args.push({
        from: cmd.from || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",
        gas: cmd.gas || 1000000,
        gasPrice: cmd.gasPrice || 1,
		value: cmd.value || 0
    });

	try {
		var result = contract[cmd.method].apply(contract, getVariables(args));
	}
	catch (ex) {
		return cb(ex, null);
	}
	
    var value = getResultValue(result);
    
    processExpected(cmd.expected, value);    
        
    console.log('call result:', value);
    cb(null, null);
}

function executeInvoke(cmd, cb) {
    var msg = cmd.message || "invoke...";
    console.log(msg);
        
    getWeb3();
    
    var contract = contracts[cmd.contract];
    
    var args = cmd.arguments.slice();
    args.push({
        from: getVariable(cmd.from) || "cd2a3d9f938e13cd947ec05abc7fe734df8dd826",
        gas: cmd.gas || 1000000,
        gasPrice: cmd.gasPrice || 1,
		value: cmd.value || 0
    });
    
	try {
		var result = contract[cmd.method].apply(contract, getVariables(args));
	}
	catch (ex) {
		return cb(ex, null);
	}

    console.log('result', result);
    console.dir(result);

    processVariable(cmd.variable, result);
    
    getTransactionReceipt(result, cb);
}

function executeEvent(cmd, cb) {
    var msg = cmd.message || "event...";
    console.log(msg);
        
    getWeb3();
    
    var contract = contracts[cmd.contract];
    
    var filter = cmd.filter || {};
        
    var result = contract[cmd.method].apply(contract, [filter, function (err, data) {
        if (err)
            console.log('event error');
        else
            console.log('event result', JSON.stringify(data, null, 2));
    }]);

    console.log('result', result);
    console.dir(result);
    
    cb(null, null);
}

function executeSet(cmd, cb) {
    var msg = cmd.message || "set...";
    console.log(msg);
	
	variables[cmd.variable] = getVariable(cmd.value);
	
	console.log("variable", cmd.variable, "value", variables[cmd.variable]);
	
	cb(null, null);
}

var nsteps = test.steps.length;
var k = 0;

doStep();

var tries = 0;

function doStep() {
    if (k >= nsteps) {
		if (nunexpected) {
			console.log('unexpected values', nunexpected);
			process.exit(2);			
		}
		else {
			console.log('OK');
			process.exit(0);
		}
		
        return;
    }
        
    var step = test.steps[k++];

    if (step.type === 'contract')
        executeContract(step, cb);
    else if (step.type === 'contractx')
        executeContractEx(step, cb);
    else if (step.type === 'contractdef')
        defineContract(step, cb);
    else if (step.type === 'use')
        executeUse(step, cb);
    else if (step.type === 'call')
        executeCall(step, cb);
    else if (step.type === 'invoke')
        executeInvoke(step, cb);
    else if (step.type === 'event')
        executeEvent(step, cb);
    else if (step.type === 'transaction')
        executeTransaction(step, cb);
    else if (step.type === 'transfer')
        executeTransfer(step, cb);
    else if (step.type === 'personal_transfer')
        executePersonalTransfer(step, cb);
    else if (step.type === 'balance')
        executeBalance(step, cb);
    else if (step.type === 'account')
        executeAccount(step, cb);
    else if (step.type === 'personal_account')
        executePersonalAccount(step, cb);
    else if (step.type === 'set')
        executeSet(step, cb);
    else if (step.type === 'goto') {
        k = step.index;
        cb(null, null);
    }
        
    function cb(err, data) {
        if (err) {
            console.log('error:', err);
			
			tries++;
			
			if (tries >= 3) {
				// too many retries
				console.log('too many retries in step')
				process.exit(1);
				return;
			}
			
			k--;  // retry step
        }
		else
			tries = 0;
        
        doStep();
    }
}

function getInputParamsFromCommandLineIfAny(){
	for(var i = 2; i < process.argv.length; i++) {
		switch(process.argv[i]){
			case '-server':
				if (process.argv[i + 1] == null)
				{
					console.log('Please specify server address to use. Example: node console -server www.remote.com:8888');
					console.log('If port is not specified connection will try port 80.');
					process.exit(0);
				}
				server = process.argv[i + 1];
                console.log('using node at', server);
                i++;
				break;
		}
	};
}

