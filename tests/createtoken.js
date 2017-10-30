
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var contracts = require('./lib/contracts');
var commands = require('./lib/commands');

var config = require('./config.json');

var contract = contracts.compile('token.sol:Token', 'token.sol');

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
        console.log('new contract', data);
    })
    .error(function (err) {
        console.log(err);
    });

