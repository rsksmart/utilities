var ecc = require('tiny-secp256k1')
var crypto = require('crypto')
var typeforce = require('typeforce')
var payments = require('./bitcoinjs-payments')
var ethereumjs = require('ethereumjs-util')
var bitcoin = require('bitcoinjs-lib')
var wif = require('wif')

var types = {
    Buffer256bit: typeforce.BufferN(32)
}

var generatePrivateKey = function()
{
    var result
    do {
        result = crypto.randomBytes(32)
        typeforce(types.Buffer256bit, result)
    } while (!ecc.isPrivate(result));

    return result;
}

var generateWifPrivateKey = function(isTesnet)
{
    var privateKey = generatePrivateKey();
    var network = isTesnet?bitcoin.networks.testnet.wif:bitcoin.networks.bitcoin.wif;
    return wif.encode(network, privateKey, true);
}

var privateKeyFromWif = function(privateKey){
    return wif.decode(privateKey).privateKey;
}

var generatePublicKey = function(privateKey)
{
    if (privateKey == null) {
        console.error('Must specify a privateKey');
        return;
    }
 
    if (ecc.isPrivate(privateKey))
    {
        var publicKey = ecc.pointFromScalar(privateKey, true);
        return publicKey;
    }
}

var generateBitcoinAddress = function(publicKey, isTesnet)
{
    if (publicKey == null) {
        console.error('Must specify a publicKey');
        return;
    }

    var network = isTesnet?bitcoin.networks.testnet:bitcoin.networks.bitcoin;

    var addressPayments = payments.p2pkh({ pubkey: publicKey, network: network })

    return addressPayments.address;
}

var generateRSKAddressFromBitcoinPrivateKey = function(privateKey)
{
    if (privateKey == null) {
        console.error('Must specify a privateKey');
        return;
    }
    
    return ethereumjs.privateToAddress(wif.decode(privateKey).privateKey);
}

var generateRSKAddress = function(publicKey)
{
    if (publicKey == null) {
        console.error('Must specify a publicKey');
        return;
    }
    
    return ethereumjs.pubToAddress(publicKey,true);
}

var generateRskPrivateKey = function(btcPrivateKey){
	return privateKeyFromWif(btcPrivateKey);
}

function getRSKAddressFromBTCPublicKey(pubKey){  
    var publicToHex = new Buffer(pubKey, 'hex');
    var address = ethereumjs.pubToAddress(publicToHex,true);
    return '0x' + address.toString('hex');
  }

module.exports = {
    generateWifPrivateKey: generateWifPrivateKey,
    generatePublicKey: generatePublicKey,
    generateBitcoinAddress: generateBitcoinAddress,
    generateRSKAddress: generateRSKAddress,
    generateRSKAddressFromBitcoinPrivateKey: generateRSKAddressFromBitcoinPrivateKey,
    generateRskPrivateKey : generateRskPrivateKey,
    getRSKAddressFromBTCPublicKey : getRSKAddressFromBTCPublicKey
}