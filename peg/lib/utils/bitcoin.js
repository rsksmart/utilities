var bitcoin = require('bitcoin');
var bitcoinLib = require('bitcoinjs-lib');

var client;
var network = bitcoinLib.networks.testnet; 
var txVersion = 1;
var fee = 0.001;

function initBitcoinClient(host, port, user, pass) {
  client = new bitcoin.Client({
    host: host,
    port: port,
    user: user,
    pass: pass
  });
}

function setNetwork(testnet) {
  network = testnet ? bitcoinLib.networks.testnet : bitcoinLib.networks.bitcoin;
}

function transferBtcToSbtc(address, privateKey, value) {
  if(client == null){
    console.log('You need to init the bitcoin client to use this method.')
  }

  client.importAddress(address, function (err, response, headers) {
      if (err) return console.log(err);
      client.listUnspent(0, function (err, utxos, headers) {
          if (err) return console.log(err);

          var utxosByAddress = getUTXOsByAddress(utxos, [address]);
          var txb = buildTransaction(address, utxosByAddress, value);
          var signedTx = signTx(txb, privateKey);

          client.sendRawTransaction(signedTx, function (err, response, resHeaders) {
              if (err) return console.log(err);
              return response;
          });
      });
  });
}

function getUTXOsByAddress(utxos, addresses) {
  return utxos.filter(utxo =>
      addresses.includes(utxo.address) &&
      utxo.confirmations >= 1); // TODO 1?
}

function btcToSatoshi(amount) {
  var BTC_IN_SATOSHIS = Math.pow(10, 8);
  return Math.round(amount * BTC_IN_SATOSHIS);
}

function buildTransaction(address, utxos, amount) {
  var txb = new bitcoinLib.TransactionBuilder(network);
  txb.setVersion(txVersion);

  let input_amount = 0;
  let i = 0;
  // TODO revisar cómo hacer esta iteración
  while (i < utxos.length && input_amount < amount + fee) {
      txb.addInput(utxos[i].txid, utxos[i].vout);
      input_amount += utxos[i].amount;
      i++;
  }

  var change = input_amount - amount - fee;

  console.log(btcToSatoshi(change));
  //TODO: call bridge
  var FEDERATION_ADDRESS = "2N5muMepJizJE1gR7FbHJU6CD18V3BpNF9p";

  if (change <= 0)
    return console.log('Error in fee.');

  txb.addOutput(FEDERATION_ADDRESS, btcToSatoshi(amount));
  txb.addOutput(address, btcToSatoshi(change));
  return txb;
}

function signTx(tx, privateKey) {
  var keyPair = bitcoinLib.ECPair.fromWIF(privateKey, network);
  tx.sign(0, keyPair);
  return tx.build().toHex();
}

module.exports = {
  initBitcoinClient : initBitcoinClient,
  setNetwork : setNetwork,
  transferBtcToSbtc : transferBtcToSbtc,
  btcToSatoshi : btcToSatoshi,
  signTx : signTx,
  getUTXOsByAddress : getUTXOsByAddress
}