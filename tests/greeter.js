
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var contracts = require('./lib/contracts');
var commands = require('./lib/commands');
var utils = require('./lib/utils');

var config = require('./config.json');

var contract = contracts.compile('greeter.sol:greeter', 'greeter.sol');

sargs
		.define('h', 'host', config.host, 'Host JSON RPC entry point')
		.define('f', 'from', config.account, 'Initial account');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

async()
	.exec(function (next) {
		commands.createContract(host, argv.from, 0, contract.bytecode, next);
	})
	.then(function (data, next) {
		contract.address = data;
		console.log('new contract', contract.address);
		commands.callTransaction(host, argv.from, contract.address, 0, { data: contracts.encodeCall(contract, 'getMessage()', []) }, next);
	})
	.then(function (data, next) {
		console.log('value', utils.decodeValue(data));
		commands.processTransaction(host, argv.from, contract.address, 0, { gas: 1000000, data: contracts.encodeCall(contract, 'setMessage(string)', [ 'Hello, world' ]) }, next);
	})
	.then(function (data, next) {
		commands.callTransaction(host, argv.from, contract.address, 0, { data: contracts.encodeCall(contract, 'getMessage()', []) }, next);
	})
	.then(function (data, next) {
		console.log('value', utils.decodeValue(data));
	})
	.error(function (err) {
		console.log(err);
	});

