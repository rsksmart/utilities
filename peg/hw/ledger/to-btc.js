var fs = require('fs');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
const ledger = require('ledgerco');
var ethereumjs = require('ethereumjs-util')
var sync = require('synchronize');

var await = sync.await;
var defer = sync.defer;
var fiber = sync.fiber;

var valueToSend;
var account;
var rskNode;
var data;
var rawTx;
var derivationPath;
var chainId;

var getNonce = sync(getNonce);
var getGasPrice = sync(getGasPrice);

function getWeb3() {
  if (web3) {
    return web3;
  }

  console.log('Using web3', rskNode);
  web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(rskNode));

  return web3;
}

function readConfig(){
  const obj=JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  rskNode = obj.rskNode;
  valueToSend = obj.valueToSend;
  account = obj.account;
  gas = obj.gas;
  data = obj.data;
  chainId = obj.chainId;
  derivationPath = obj.derivationPath;  
}

var web3;
readConfig();
getWeb3();

function buildTx(account, nonce, gas, gasPrice) {
  console.log("Account " + account);
  console.log("Gas " + gas);
  console.log("Gasprice " + gasPrice);
  console.log("Nonce " + nonce);
  var rawTx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gas: gas,
    value: valueToSend,
    to: account,
    v: chainId,
    r: 0,
    s: 0,
    data: data
  };

  var tx = new Tx(rawTx);
  console.log(rawTx);
  return tx;
}

function getNonce(senderAddress){
  return dec2hexString(web3.eth.getTransactionCount(senderAddress, "pending"));  
}

function getGasPrice(){
  var block = web3.eth.getBlock("latest")  
  if (block.minimumGasPrice <= 1) {
    return dec2hexString(1);
  } else {
    return dec2hexString(block.minimumGasPrice * 1.0001);
  }
}

function dec2hexString(dec) {
  return '0x' + dec.toString(16).toUpperCase();
}

function releaseRbtc(){
  ledger.comm_node.create_async().then(
    function(comm) {
      var eth = new ledger.eth(comm);

      eth.getAddress_async(derivationPath).then(
        function(result) {
          var senderAddress = result["address"]; 
          console.log("Sender address: ", senderAddress);
          rawTx = buildTx(account, getNonce(senderAddress), gas, getGasPrice());
          
          eth.signTransaction_async(derivationPath, rawTx.serialize().toString('hex')).then(
            function(result){
              rawTx.r = Buffer.from(result['r'], 'hex');
              rawTx.v = Buffer.from(result['v'], 'hex');
              rawTx.s = Buffer.from(result['s'], 'hex');
              console.log("Raw tx: ", rawTx.serialize().toString('hex'));
              var txHash = web3.eth.sendRawTransaction('0x' + rawTx.serialize().toString('hex'));
              console.log(txHash);
            });
        });
    });
};

releaseRbtc();