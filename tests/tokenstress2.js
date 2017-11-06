
var rskapi = require('rskapi');
var sargs = require('simpleargs');
var async = require('simpleasync');

var contracts = require('./lib/contracts');
var commands = require('./lib/commands');
var utils = require('./lib/utils');

var config = require('./config.json');

var contract = contracts.compile('token.sol:Token', 'token.sol');

sargs
    .define('h', 'host', config.host, 'Host JSON RPC entry point')
    .define('f', 'from', config.account, 'Initial account')
    .define('c', 'count', 10, 'Transactions to send');

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

function createAddress() {
	var buffer = new Buffer(20);
	
	for (var k = 0; k < buffer.length; k++)
		buffer[k] = Math.floor(Math.random() * 256);
	
	return '0x' + buffer.toString('hex');
}

function invokeTransfer(cb) {
	var address = createAddress();
	console.log('address', address);
	
    async().exec(function (next) {
        commands.unlockAccount(host, argv.from, next);
    })
    .then(function (data, next) {
        commands.sendTransaction(host, argv.from, contract.address, 0, { gas: 1000000, data: contracts.encodeCall(contract, 'transfer(address,uint256)', [ address, 1 ]) }, cb);
    })
	.error(cb);
}

async()
    .exec(function (next) {
        commands.unlockAccount(host, argv.from, next);
    })
    .then(function (data, next) {
        commands.createContract(host, argv.from, 0, contract.bytecode, next);
    })
    .then(function (data, next) {
        contract.address = data;
        console.log('new contract', contract.address);
        commands.callTransaction(host, argv.from, contract.address, 0, { data: contracts.encodeCall(contract, 'balances(address)', [ argv.from ]) }, next);
    })
    .then(function (data, next) {
        console.log('value', utils.decodeValue(data));
        utils.repeat(invokeTransfer, argv.count, next);
    })
    .error(function (err) {
        console.log(err);
    });

