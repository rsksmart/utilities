var assert = require('assert');
var bitcoin = require('../utils/bitcoin');
var bitcoinLib = require('bitcoinjs-lib');

describe('Bitcoin', function() {
  describe('#btcToSatoshi()', function() {
    it('Should return 0 when parameter is 0', function() {
      assert.equal(bitcoin.btcToSatoshi(0), 0);
    });
    it('Should return 100000000 when parameter is 1', function() {
      assert.equal(bitcoin.btcToSatoshi(1), 100000000);
    });
    it('Should return 2800000000 when parameter is 28', function() {
      assert.equal(bitcoin.btcToSatoshi(28), 2800000000);
    });
  });  
  describe('#signTx()', function() {
    var txb1 = createTransaction();
    var txb2 = createTransaction();
    it('Should return the different value when signing with different privatekey', function() {
      var signTx1 = bitcoin.signTx(txb1, "cPd7zPqFePa5bQVG1jqjbAKcQ5waCHDf8mMsYBTiF6vXszgj99D2");
      var signTx2 = bitcoin.signTx(txb2, "cPNjrbGnvYiVEpaYqfcuK915LZkvbP2Z8BHavFcRdRtzPmRVvKTo");
      assert.notEqual(signTx1, signTx2);
    });
  });  
  describe('#getUXTOsByAddress()', function() {
    var existingAddress = "mzMJgrDAdCkEP32dt5VHgAE1ScSxQVtQGj";
    var nonExistingAddress = "mxHZFwdHxstcvedEHVgf5aahuPYVfS9ZZS";
    var utxos = createUTXOs(existingAddress);
    it('Should return more than 1 utxo with the address', function() {
      var filteredUtxos = bitcoin.getUTXOsByAddress(utxos, existingAddress);
      assert.equal(filteredUtxos.length, 1);
    });
    it('Should return more than 0 utxo with the address', function() {
      var filteredUtxos = bitcoin.getUTXOsByAddress(utxos, nonExistingAddress);
      assert.equal(filteredUtxos.length, 0);
    });
  });  
});


function createTransaction(){
  var network = bitcoinLib.networks.testnet; 
  var txb = new bitcoinLib.TransactionBuilder(network);
  var BTC_IN_SATOSHIS = Math.pow(10, 8);  
  txb.setVersion(1);
  txb.addInput(new Buffer("3520e9fdbcc6cad965bb36a8b5952595ec7bfe6e7f42068d382127a82819a112", "hex"), 0);
  txb.addOutput("n145eqKFHuR96vdc35sAiphnhCvxvFt7Ln", 5 * BTC_IN_SATOSHIS);
  txb.addOutput("n145eqKFHuR96vdc35sAiphnhCvxvFt7Ln", 1 * BTC_IN_SATOSHIS);
  return txb;
}

function createUTXOs(anAddress){
  var utxos = [];
  var utxo1 = {
      'txid': '35e2e52d2b5aa5f1fdf327923e56ba08337cda656aae5a7b6d0adc00f1df29ff',
      'vout': 0,
      'address': anAddress,
      "amount": 50.00000000,
      "confirmations": 393,
      "spendable": true,
      "solvable": true,
      "safe": true
  };
  var utxo2 = {
      "txid": "bffaab283f7f074fd681529b9dc2e90b10b2494df9854819f848c4d6652e55ff",
      "vout": 0,
      "address": "muVD6fhyDjZmHmpxGtSmeWHUitdoPzbpuu",
      "scriptPubKey": "21028a99c23685c893c86ef2126636baccbc96eb273964296e0a33b85b553ac4b2d8ac",
      "amount": 25.00000000,
      "confirmations": 121,
      "spendable": true,
      "solvable": true,
      "safe": true
  };
  utxos.push(utxo1);
  utxos.push(utxo2);
  return utxos;
}