#!/usr/bin/env node

var Web3 = require('web3');

var web3s = [];
var nnodes = 0;

if (process.argv[2] && process.argv[2].length <= 3) {
    nnodes = parseInt(process.argv[2]);

    for (var k = 0; k < nnodes; k++) {
        web3s[k] = new Web3();
        web3s[k].setProvider(new web3s[k].providers.HttpProvider('http://localhost:' + (4444 + k)));
    }    
}
else {
    nnodes = process.argv.length - 2;
    
    for (var k = 0; k < nnodes; k++) {
        web3s[k] = new Web3();
        web3s[k].setProvider(new web3s[k].providers.HttpProvider('http://' + process.argv[2 + k]));
    }
}

var timeout = 1000;

function doStep() {        
    for (var k = 0; k < nnodes; k++) {
        var minbn = 0;
        var bn = web3s[k].eth.blockNumber;
		
		if (!web3s[k].lastBlock)
			web3s[k].lastBlock = 0;
		if (!web3s[k].lastTime)
			web3s[k].lastTime = Date.now();
		
		var diffbn = bn - web3s[k].lastBlock;
		
		var difftime = Date.now() - web3s[k].lastTime;
		var velocity;
		
		if (difftime > 0)
			velocity = diffbn / difftime * 1000;
		else
			velocity = '?';

        console.log('block server ' + (k + 1) + ':', bn, '(+' + diffbn +')', '(' + velocity +' b/s)');
		
		web3s[k].lastBlock = bn;
		web3s[k].lastTime = Date.now();
		
		if (!web3s[k].lastBlock)
			web3s[k].lastBlock = 0;
		
		web3s[k].lastBlock = bn;
		
        var block = web3s[k].eth.getBlock(bn);
        
        if (block)
            console.log('hash', block.hash);
        
        if (minbn && minbn < bn) {
            var block = web3s[k].eth.getBlock(minbn);
            if (block)
                console.log('block', minbn, 'hash', block.hash);
        }
        
        if (bn < minbn || !minbn)
            minbn = bn;
        
        console.log();
    }
        
    setTimeout(doStep, timeout);
}

doStep();
