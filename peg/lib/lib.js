#!/usr/bin/env node
var argh = require('argh').argv;
var wallet = require('./utils/wallet')
var bitcoin = require('./utils/bitcoin')
var CONFIG = require('./config.json')

var generateNewWallets = function(argh) {
	var bitcoinPrivateKey = wallet.generateWifPrivateKey(CONFIG.isTestnet);
	var rskPrivateKey = wallet.generateRskPrivateKey(bitcoinPrivateKey);
	var publicKey = wallet.generatePublicKey(rskPrivateKey);
	var bitcoinAddress = wallet.generateBitcoinAddress(publicKey, CONFIG.isTestnet);
	var rskAddress = wallet.generateRSKAddress(publicKey);
	
	result = {
		'Public Key     ' : publicKey.toString('hex'),
		'BTC Private Key' : bitcoinPrivateKey,
		'BTC Address    ' : bitcoinAddress,
		'RSK Private Key' : rskPrivateKey.toString('hex'),
		'RSK Address    ' : "0x" + rskAddress.toString('hex')
	}

	console.log(result);
};

var generateRSKAddressFromBTCPrivateKey = function(argh) {
	var privateKey = argh.argv && argh.argv[0];
	var rskAddress = wallet.generateRSKAddressFromBitcoinPrivateKey(privateKey);
	if (privateKey == null || rskAddress == null) return;

	result = {
		'RSK Address' : "0x" + rskAddress.toString('hex')
	}

	console.log(result)
}

var generateRSKAddressFromBTCPublicKey = function(argh) {
	var publicKey = argh.argv && argh.argv[0];
	var rskAddress = wallet.getRSKAddressFromBTCPublicKey(publicKey);
	if (publicKey == null || rskAddress == null) return;

	result = {
		'RSK Address' : rskAddress.toString('hex')
	}

	console.log(result)
}

var toSbtc = function(argh) {
	var address = argh.argv && argh.argv[0];
	var privateKey = argh.argv && argh.argv[1];
	var amount = argh.argv && argh.argv[2];

	if (address == null) {
		console.error('Must specify a BTC address');
		return;
	}	

	if (privateKey == null) {
		console.error('Must specify the BTC private key');
		return;
	}

	if (amount == null) {
		console.error('Must specify an amount in BTC (can use decimals)');
		return;
	}

	var numericAmount = Number(amount);
	if (isNaN(numericAmount)) {
		console.error('Amount must be a decimal number');
		return;
	}

	bitcoin.initBitcoinClient(CONFIG.BTCHost, CONFIG.BTCPort, CONFIG.BTCUser, CONFIG.BTCPass);
	bitcoin.setNetWork(CONFIG.isTestnet);
	bitcoin.transferBtcToSbtc(address, privateKey, amount);
};

var toBtc = function(argh) {
	
};

var printUsage = function() {
	var w = process.stdout.write.bind(process.stdout);
	w('\n');
	w('ProxyWallet LIB - Utility for the BTC <=> RSK 2WP\n');
	w('=================================================\n\n');
	w('Usage:\n');
	w('./lib.js [options] [command]\n\n');
  w('Available commands:\n');
  w('-h\t\t\t\t\t\t\t\t Print this help message\n');
	w('-n\t\t\t\t\t\t\t\t Generate a new address pair in the local BTC and RSK wallets\n');
	w('--frombtcpriv -- [btc-privateKey]\t\t\t\t Generate a new RSK address from a Bitcoin Private Key \n');
	w('--frombtcpub -- [btc-publicKey]\t\t\t\t\t Generate a new RSK address from a Bitcoin Public Key \n');
	w('--to-sbtc -- [btc-addrgetRSKAddressFromBTCPublicKeyess] [btc-privateKey] [btc-amount]\t Send the given amount to the SBTC address corresponding to the BTC address given \n');
	w('--to-btc -- [rsk-address] [sbtc-amount]\t\t\t\t Send the given amount to the BTC address corresponding to the SBTC address given \n\n');	
	w('\n');
};

var unknownOperation = function() {
	process.stdout.write('Unknown command, use -h for help\n');
}

var OPERATIONS = {
	'h': printUsage,
	'n': generateNewWallets,
	'to-sbtc': toSbtc,
	'to-btc': toBtc,
	'frombtcpriv': generateRSKAddressFromBTCPrivateKey,
	'frombtcpub' : generateRSKAddressFromBTCPublicKey
};

// Execute first op passing arguments in
var opCode = Object.keys(argh).find(key => OPERATIONS[key] != null);
if (opCode) {
	OPERATIONS[opCode](argh);
} else {
	unknownOperation();
}
