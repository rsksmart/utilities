
var async = require('simpleasync');

function sendTransaction(host, from, to, value, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}
	
	options = options || {};
	
	var txdata = {
		from: from,
		value: value,
		gas: options.gas || 21000,
		gasPrice: options.gasPrice || 1
	};
	
	if (to)
		txdata.to = to;
	
	if (options.data)
		txdata.data = options.data;
	
	host.sendTransaction(txdata, cb);
}

function callTransaction(host, from, to, value, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}
	
	options = options || {};
	
	var txdata = {
		from: from,
		value: value,
		gas: options.gas || 21000,
		gasPrice: options.gasPrice || 1
	};
	
	if (to)
		txdata.to = to;
	
	if (options.data)
		txdata.data = options.data;

	host.callTransaction(txdata, cb);
}

function getTransactionReceipt(host, hash, ntry, cb) {
	host.getTransactionReceiptByHash(hash, function (err, data) {
		if (err)
			return cb(err, null);
			
		if (data)
			return cb(null, data);
			
		if (ntry > 60)
			return cb('Transaction ' + hash + 'not mined');
			
		setTimeout(function () {
			getTransactionReceipt(host, hash, ntry + 1, cb);
		}, 1000);
	});
}

function mineTransaction(host, hash, cb) {
	getTransactionReceipt(host, hash, 1, cb);
}

function processTransaction(host, from, to, value, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}
	
	options = options || {};

	var txhash;
	
	async()
		.exec(function (next) {
			sendTransaction(host, from, to, value, options, next);
		})
		.then(function (data, next) {
			txhash = data;
			console.log('transaction', txhash);
			mineTransaction(host, txhash, next);
		})
		.then(function (data, next) {
			console.log('transaction mined in block', parseInt(data.blockNumber, 16));
			cb(null, txhash);
		})
		.error(function (err) {
			cb(err);
		});
}

function createContract(host, from, value, code, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}
	
	options = options || {};
	
	options.data = code;
	
	if (!options.gas)
		options.gas = 3000000;

	var txhash;
	
	async()
		.exec(function (next) {
			sendTransaction(host, from, null, value, options, next);
		})
		.then(function (data, next) {
			txhash = data;
			console.log('transaction', txhash);
			mineTransaction(host, txhash, next);
		})
		.then(function (data, next) {
			console.log('contract mined in block', parseInt(data.blockNumber, 16));
			console.log('contract address', data.contractAddress);
			cb(null, data.contractAddress);
		})
		.error(function (err) {
			cb(err);
		});
}

function createAccount(host, cb) {
	host.newPersonalAccount('passphrase', cb);
}

function getBalance(host, address, cb) {
	host.getBalance(address, cb);
}

module.exports = {
	createAccount: createAccount,
	createContract: createContract,
	processTransaction: processTransaction,
	callTransaction: callTransaction,
	getBalance: getBalance
};


