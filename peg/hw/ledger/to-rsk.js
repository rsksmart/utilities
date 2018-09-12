const ledger = require('ledgerco');
const config = require('./config.json');
const bitcoreLib = require('bitcore-lib');
const bitcoinLib = require('bitcoinjs-lib');
var sync = require('synchronize');
var Web3 = require('web3');

var await = sync.await;
var defer = sync.defer;
var fiber = sync.fiber;

var getConnection = sync(getConnection);


function getBtcAddress(){
    ledger.comm_node.create_async().then(function(comm) {
        var btc = new ledger.btc(comm);
        btc.getWalletPublicKey_async(config.derivationPath)
        .then(
            function(result) { 
                console.log(result);
            }).catch(
                function(error) { 
                    console.log(error); 
            });
    });
}

// getBtcAddress();
// getFederationAddress(); 

fiber(function(){
    ledger.comm_node.create_async().then(function(comm) {        
        var btc = new ledger.btc(comm);
        buildTx(btc);    
    });   
});

function getConnection(cb){
    console.log("inicio");
    ledger.comm_node.create_async().then(function(comm) {        
        var btc = new ledger.btc(comm);
        cb(null, btc);
    });        
}

function buildTx(btc){
    // Create tx with bitcore

    
    var address = bitcoreLib.Address.fromString('mow8mDqiUCf17DxE9uV97SvDvzfYjrBzEG');
    var script = bitcoreLib.Script.buildPublicKeyHashOut(address).toString();      
      
    var utxo = {
        txId : "293c92b79334dbe189ae0df4df8a5ff5e0cd3104aadbcdf23f3139c149794f48",
        outputIndex : 0,        
        script : "76a9145c53ba5ac3221d0730118e4fc2c522bdfbabdb8e88ac",
        satoshis : 130000000        
      };

    // From a pay to public key hash output
    // transaction.from({'txId': '0000...', outputIndex: 0, satoshis: 1000, script: 'OP_DUP ...'});

    const fee = 10000;

    var transaction = new bitcoreLib.Transaction()
        .from(utxo)          // Feed information about what unspent outputs one can use        
        .to("2MyYqLW8mQHgKtBCqnkaKofRRp2BXCF6B4B", 10000000) // Add an output with the given amount of satoshis        
        .change("mow8mDqiUCf17DxE9uV97SvDvzfYjrBzEG");// Sets up a change address where the rest of the funds will go  
            

    const rawtx = transaction.toString('hex');    
    
    const bufferedInput =  btc.splitTransaction(rawtx);    
    const outputScript =  btc.serializeTransactionOutputs(bufferedInput).toString('hex');

    // Sign it    
    
    btc.createPaymentTransactionNew_async(
      [[bufferedInput,0]],
      [config.derivationPath],
      config.derivationPath,      
      outputScript
    ).then(console.log)
    .catch(err => console.error(err));
}

function generateTx(){
    try
    {
        let testnet = bitcoinLib.networks.testnet;

        var tx = new bitcoinLib.TransactionBuilder(testnet);
        tx.setVersion(1);
        tx.addInput("293c92b79334dbe189ae0df4df8a5ff5e0cd3104aadbcdf23f3139c149794f48", 0);
            
        //console.log("Change:" + change);
        
        tx.addOutput('2MyYqLW8mQHgKtBCqnkaKofRRp2BXCF6B4B', 10000000); //Bridge address!
        tx.addOutput("mow8mDqiUCf17DxE9uV97SvDvzfYjrBzEG", 30000000);

        console.log(tx.toString());
    }
    catch(err){
        console.log(err);
    }
}


var web3;
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