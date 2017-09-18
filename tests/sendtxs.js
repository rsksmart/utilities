
var rskapi = require('rskapi');
var async = require('simpleasync');
var sargs = require('simpleargs');

sargs
	.define('h', 'host', 'http://localhost:4444', 'Host JSON RPC entry point')
	.define('f', 'from', '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'Initial account')
	.define('c', 'count', 10, 'Transactions to send')

var argv = sargs(process.argv.slice(2));

var host = rskapi.host(argv.host);

function getAccounts(cb) {
	host.getAccounts(cb);
}

var target;
var txhash;

function getTransactionReceipt(hash, ntry, cb) {
	host.getTransactionReceiptByHash(hash, function (err, data) {
		if (err)
			return cb(err, null);
			
		if (data)
			return cb(null, data);
			
		if (ntry > 60)
			return cb('Transaction ' + hash + 'not mined');
			
		setTimeout(function () {
			getTransactionReceipt(hash, ntry + 1, cb);
		}, 1000);
	});
}

function createTargetAccount(cb) {
	host.newPersonalAccount('passphrase', cb);
}

function sendTransaction(cb) {
	host.sendTransaction({
		from: argv.from,
		to: target,
		value: 100000,
		gas: 21000,
		gasPrice: 1
	}, cb);
}

function mineTransaction(hash, cb) {
	getTransactionReceipt(hash, 1, cb);
}

var counter = 0;

function sendTransactions(cb) {
	counter++;

	if (counter > argv.count)
		return cb(null, null);
		
	async()
		.exec(function (next) {
			sendTransaction(next);
		})
		.then(function (data, next) {
			console.log('transaction', data);
			mineTransaction(data, next);
		})
		.then(function (data, next) {
			console.log('transaction mined in block', parseInt(data.blockNumber, 16));
			
			setTimeout(function () {
				sendTransactions(cb);
			}, 0);
		})
		.error(function(err) {
			cb(err);
		});
}

async()
	.exec(function (next) {
		createTargetAccount(next);
	})
	.then(function (data, next) {
		target = data;
		console.log('new account', target);
		sendTransactions(next);
	})
	.then(function (data, next) {
		host.getBalance(target, next);
	})
	.then(function (data, next) {
		console.log('account balance', parseInt(data, 16));
	})
	.error(function (err) {
		console.log(err);
	});

