const ledger = require('ledgerco');
const config = require('./config.json');
var sync = require('synchronize');
var Web3 = require('web3');
var web3;

function getBtcAddress(){    
    ledger.comm_node.create_async().then(function(comm) {
        var btc = new ledger.btc(comm);        
        btc.getWalletPublicKey_async(config.derivationPath)
        .then(
            function(result) { 
                console.log('BTC Address');
                console.log('Derivation Path: ' + config.derivationPath);
                console.log(result);
            }).catch(
                function(error) { 
                    console.log(error); 
            });
    });
}

function getWeb3() {
    if (web3) {
        return web3;
    }

    console.log('Using web3', config.rskNode);
    web3 = new Web3(new Web3.providers.HttpProvider(config.rskNode));
    return web3;
}

function getFederationAddress(){
    getWeb3();
      var bridgeAbi = '[{ "name": "getFederationAddress", "type": "function", "constant": true, "inputs": [], "outputs": [{ "name": "", "type": "string" }] }]'
      var bridgeAddress = "0x0000000000000000000000000000000001000006"
      var bridgeContract = web3.eth.contract(JSON.parse(bridgeAbi)).at(bridgeAddress);
      var res = bridgeContract.getFederationAddress();
      console.log('Federation Address: ' + res);      
}


getBtcAddress();
getFederationAddress();
