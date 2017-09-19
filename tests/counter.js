
var rskapi = require('rskapi');
var cmds = require('./lib/cmds');
var sargs = require('simpleargs');
var async = require('simpleasync');
var contracts = require('./lib/contracts');

var contract = contracts.compile('counter.sol:counter', 'counter.sol');

sargs
	.define('h', 'host', 'http://localhost:4444', 'Host JSON RPC entry point')
	.define('f', 'from', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'Initial account');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

async()
	.exec(function (next) {
		cmds.createContract(host, argv.from, 0, contract.bytecode, next);
	})
	.then(function (data, next) {
		contract.address = data;
		console.log('new contract', contract.address);
		cmds.callTransaction(host, argv.from, contract.address, 0, { data: contract.functionHashes['getValue()'] }, next);
	})
	.then(function (data, next) {
		console.log('value', contracts.decodeValue(data));
		cmds.processTransaction(host, argv.from, contract.address, 0, { gas: 2000000, data: contract.functionHashes['increment()'] }, next);
	})
	.then(function (data, next) {
		cmds.callTransaction(host, argv.from, contract.address, 0, { data: contract.functionHashes['getValue()'] }, next);
	})
	.then(function (data, next) {
		console.log('value', contracts.decodeValue(data));
	})
	.error(function (err) {
		console.log(err);
	});

