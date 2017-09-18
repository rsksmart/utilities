
var rskapi = require('rskapi');
var cmds = require('./lib/cmds');
var sargs = require('simpleargs');
var async = require('simpleasync');
var contracts = require('./lib/contracts');

var contract = contracts.compile('greeter.sol:greeter', 'greeter.sol');

sargs
	.define('h', 'host', 'http://localhost:4444', 'Host JSON RPC entry point')
	.define('f', 'from', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'Initial account');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

function sendTransactions(counter, cb) {
	if (counter <= 0)
		return cb(null, null);
		
	async()
		.exec(function (next) {
			cmds.processTransaction(host, argv.from, target, 100000, next);
		})
		.then(function (data, next) {
			setTimeout(function () {
				sendTransactions(counter - 1, cb);
			}, 0);
		})
		.error(function(err) {
			cb(err);
		});
}

var target;

async()
	.exec(function (next) {
		cmds.createContract(host, argv.from, target, 100000, contract.runtimeBytecode, next);
	})
	.then(function (data, next) {
		console.log('new contract', data);
	})
	.error(function (err) {
		console.log(err);
	});

