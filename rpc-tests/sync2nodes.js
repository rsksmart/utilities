#!/usr/bin/env node

var Web3 = require('web3');

var web31 = new Web3();
var web32 = new Web3();

var server1 = "localhost:4444";
var server2 = "localhost:4445";
var timeout = 1000;

web31.setProvider(new web31.providers.HttpProvider('http://' + server1));
web32.setProvider(new web32.providers.HttpProvider('http://' + server2));

function doStep() {        
    var bn = web31.eth.blockNumber;
    console.log('block server 1:', bn);
    console.log('hash', web31.eth.getBlock(bn).hash);
    console.log();
    
    var bn = web32.eth.blockNumber;
    console.log('block server 2:', bn);
    console.log('hash', web32.eth.getBlock(bn).hash);
    console.log();
        
    setTimeout(doStep, timeout);
}

doStep();
