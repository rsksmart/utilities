
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var cmds = require('./lib/cmds');
var utils = require('./lib/utils');

sargs
	.define('h', 'host', 'http://localhost:4444', 'Host JSON RPC entry point')
	.define('f', 'from', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'Initial account')
	.define('c', 'count', 10, 'Transactions to send')

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

function sendTransaction(cb) {
	cmds.processTransaction(host, argv.from, target, 100000, cb);
}

var target;

async()
	.exec(function (next) {
		cmds.createAccount(host, next);
	})
	.then(function (data, next) {
		target = data;
		console.log('new account', target);
		utils.repeat(sendTransaction, argv.count, next);
	})
	.then(function (data, next) {
		cmds.getBalance(host, target, next);
	})
	.then(function (data, next) {
		console.log('account balance', parseInt(data, 16));
	})
	.error(function (err) {
		console.log(err);
	});

