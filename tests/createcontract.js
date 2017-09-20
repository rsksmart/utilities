
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var contracts = require('./lib/contracts');
var commands = require('./lib/commands');

var contract = contracts.compile('greeter.sol:greeter', 'greeter.sol');

sargs
	.define('h', 'host', 'http://localhost:4444', 'Host JSON RPC entry point')
	.define('f', 'from', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'Initial account');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

async()
	.exec(function (next) {
		commands.createContract(host, argv.from, 0, contract.bytecode, next);
	})
	.then(function (data, next) {
		console.log('new contract', data);
	})
	.error(function (err) {
		console.log(err);
	});

