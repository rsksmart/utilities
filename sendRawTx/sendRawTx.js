var fs = require('fs');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var key;
var senderAddress;
var valueToSend;
var gasPrice;
var account;
var rskNode;

function getWeb3() {
  if (web3)
    return web3;

  console.log('using web3', rskNode);
  web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://' + rskNode));

  return web3;
}

function readConfig(){
  const obj=JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  rskNode = obj.rskNode;
  senderAddress = obj.senderAddress;
  privateKey = new Buffer(obj.privateKey, 'hex');
  valueToSend = obj.valueToSend;
  account = obj.account;
  gas = obj.gas;
}

var web3;
readConfig();
getWeb3();

function buildTx(account, nonce, gas) {
  var rawTx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gas: gas,
    value: valueToSend,
    to: account
  }
    
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  return serializedTx;
}


function getNonce(){
  var result = web3.eth.getTransactionCount(senderAddress, "pending");
  return result;
}

function getGas(){
  var block = web3.eth.getBlock("latest")
  if (block.minimumGasPrice <= 21000) {
    return 21000;
  } else {
    return block.minimumGasPrice;
  }
}

var rawTx = buildTx(account, getNonce(senderAddress), getGas());
console.log(rawTx.toString('hex'));