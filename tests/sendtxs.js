
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
	console.log('sending tx');
    commands.sendTransaction(host, argv.from, target, 100000, cb);
}

var target;

async()
    .exec(function (next) {
        commands.createAccount(host, next);
    })
    .then(function (data, next) {
        target = data;
        console.log('new account', target);
        utils.repeat(sendTransaction, argv.count, next);
    })
    .then(function (data, next) {
        commands.getBalance(host, target, next);
    })
    .then(function (data, next) {
        console.log('account balance', parseInt(data, 16));
    })
    .error(function (err) {
        console.log(err);
    });

