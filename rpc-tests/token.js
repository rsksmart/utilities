// Create and run token contract, WIP

var Web3 = require('web3');

var web3 = new Web3();

var server = "localhost:4444";

getInputParamsFromCommandLineIfAny();

web3.setProvider(new web3.providers.HttpProvider('http://' + server));

// data: from compiled code at https://chriseth.github.io/browser-solidity/

function createContract() {
    console.log('creating contract');

    var result = web3.eth.sendTransaction({     
        from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",     
        data: "60606040525b612710600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b6101fc8061004a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806390b98a1114610044578063bbd39ac01461007957610042565b005b61006360048080359060200190919080359060200190919050506100c0565b6040518082815260200191505060405180910390f35b61008f60048080359060200190919050506100a5565b6040518082815260200191505060405180910390f35b60006000506020528060005260406000206000915090505481565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561010257600090506101f6565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f16cdf1707799c6655baac6e210f52b94b7cec08adcaf9ede7dfe8649da926146338484604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a1600190506101f6565b9291505056",
        gasPrice: 1,     
        gasLimit: 1000000 });

    console.log('transaction hash', result);
    
    return result;
}

function getContractAddress(trhash) {
    var transaction = web3.eth.getTransactionReceipt(trhash);
    console.dir(transaction);
    
    if (transaction) {
        console.log('contract address', transaction.contractAddress)
        return transaction.contractAddress;
    }
    
    return null;
}

function tryGetContractAddress(cb) {
    var caddress = getContractAddress(trhash);
    
    if (caddress) {
        cb(null, caddress);
        return;
    }
    
    setTimeout(function () {
            tryGetContractAddress(cb);
        }
        , 10000);
}

var trhash = createContract();

tryGetContractAddress(function (err, data) {
    // contract address
    var caddress = '0x' + data;

    // define token interface
    var tokenDefinition = web3.eth.contract([{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"coinBalanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"CoinTransfer","type":"event"}]);
    
    // get token instance at address
    console.log('getting token instance');
    var token = tokenDefinition.at(caddress);

    console.log('balance account from after contract creation', token.coinBalanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'));
    
    // invoke contract sendCoin method
    console.log('calling sendCoin');
    var result = token.sendCoin('0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d', 1000, { from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', gasLimit: 1000000, gasPrice: 1 });

    console.log('result', result);
    
    setTimeout(function () {
        console.log('balance account from', token.coinBalanceOf.call('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'));
        console.log('balance account to', token.coinBalanceOf.call('0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d'));

        console.log('done');
        process.exit(0);
    }, 20000);
});

function getInputParamsFromCommandLineIfAny(){
	for(var i = 2; i < process.argv.length; i = i + 2 ) {
		switch(process.argv[i]){
			case '-server':
				if (process.argv[i + 1] == null)
				{
					console.log('Please specify server address to use. Example: node console -server www.remote.com:8888');
					console.log('If port is not specified connection will try port 80.');
					process.exit(0);
				}
				server = process.argv[i + 1];
				break;
			default: 
				console.log('Invalid option.');
				process.exit(0);
		}
	};
}
