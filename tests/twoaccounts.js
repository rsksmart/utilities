
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var commands = require('./lib/commands');
var utils = require('./lib/utils');

var config = require('./config.json');

sargs
	.define('h', 'host', config.host, 'Host JSON RPC entry point')
	.define('f', 'from', config.account, 'Initial account')
	.define('c', 'count', 10, 'Transactions to send');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

function sendTransaction(cb) {
	commands.processTransaction(host, argv.from, target, 100000, cb);
}

var account1;
var account2;

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
		commands.unlockAccount(host, account1, next);
	})
	.then(function (data, next) {
		commands.processTransaction(host, account1, account2, 50000, next);
	})
	.then(function (data, next) {
		commands.getBalance(host, account2, next);
	})
	.then(function (data, next) {
		console.log('account balance', account2, parseInt(data, 16));
	})
	.error(function (err) {
		console.log(err);
	});

