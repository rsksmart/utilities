
var Web3 = require('web3');
var saccounts = require('./accounts');
var http = require('http');
var url = require('url');

// From liqueed project (acyment/ajlopez et al)

function doRequest(method, pageurl, data, cb) {
    var urldata = url.parse(pageurl);

    if (!cb) {
        cb = data;
        data = null;
    }

    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: method
    };

    if (data)
        options.headers = { 'Content-Type': 'application/json' };

    var req = http.request(options, function(res) {
        var buffer = '';
        
        res.on('data', function(d) {
            var text = d.toString();
            buffer += text;
        });

        res.on('err', function(err) {
            cb(err);
        });

        res.on('end', function(d) {
            if (d) {
                var text = d.toString();
                buffer += text;
            }

            cb(null, buffer);
        });
    });

    if (data)
        req.write(data);

    req.end();
}

var nodes = {};

function Node(host) {
    var web3 = new Web3();
    console.log('Using host', host);
    web3.setProvider(new web3.providers.HttpProvider('http://' + host));
    
    this.createContract = function (contract, cb) {
        var code = contract.code;
        var abi = contract.abi;
        var account = saccounts.getById(1);
        
        var address = "cd2a3d9f938e13cd947ec05abc7fe734df8dd826";
        
        if (account && account.address)
            address = account.address;
        
        var trhash = web3.eth.sendTransaction({     
            from: address,     
            data: code,    
            gasPrice: 1,     
            gas: 300000 });
    
        getContractAddress(trhash, function (err, caddress) {
            if (err)
                return cb(err, null);
            
            var contractDefinition = web3.eth.contract(abi);
        
            var contract = contractDefinition.at(caddress);
            
            console.log('balance', address, contract['coinBalanceOf'].apply(contract, ['0x' + address]));
            
            cb(null, { contract: contract, address: caddress });
        });
    };
    
    this.getBlock = function (id, cb) {
        if (!web3.isConnected())
            if (cb)
                return cb('Not connected', null);
            else
                return null;
            
        if (cb)
            web3.eth.getBlock(id, cb);
        else    
            return web3.eth.getBlock(id);
    }
    
    this.getTransaction = function (id, cb) {
        if (!web3.isConnected())
            if (cb)
                return cb('Not connected', null);
            else
                return null;

        if (cb)
            web3.eth.getTransaction(id, cb);
        else    
            return web3.eth.getTransaction(id);
    }
    
    this.sendTransaction = function (tx, cb) {
        if (!web3.isConnected())
            if (cb)
                return cb('Not connected', null);
            else
                return null;

        if (cb)
            web3.eth.sendTransaction(tx, cb);
        else    
            return web3.eth.sendTransaction(tx);
    }
    
    this.getBalance = function (id, cb) {
        if (!web3.isConnected())
            if (cb)
                return cb('Not connected', null);
            else
                return null;

        if (cb)
            web3.eth.getBalance(id, cb);
        else    
            return web3.eth.getBalance(id);
    }
    
    this.importKey = function (key, cb) {
        var server = 'http://' + host;
        
        var data = JSON.stringify({
                id: 99999999,
                method: 'eth_addAccount',
                params: [key]
            });

        doRequest('POST', server, data, function (err, data) {
                if (err)
                    cb(err, null);
                else
                    cb(null, JSON.parse(data).result);
            });        
    }
    
    function getTransactionReceipt(hash, cb) {
        var transaction = web3.eth.getTransactionReceipt(hash);
        
        if (transaction)
            console.dir(transaction);
        else
            console.log('waiting for transaction');
        
        if (transaction)
            cb(null, transaction);
        else
            setTimeout(function () {
                getTransactionReceipt(hash, cb);
            }, 10000);    
    }
    
    function getTransaction(hash, cb) {
        var transaction = web3.eth.getTransaction(hash);
        
        if (transaction)
            console.dir(transaction);
        else
            console.log('waiting for transaction');
        
        if (transaction)
            cb(null, transaction);
        else
            setTimeout(function () {
                getTransaction(hash, cb);
            }, 10000);    
    }

    function getContractAddress(hash, cb) {
        getTransactionReceipt(hash, function (err, transaction) {
            if (err)
                return cb(err, null);
            
            if (!transaction)
                return cb('contract transaction not found', null);

            console.log('contract address', transaction.contractAddress);
            
            cb(null, transaction.contractAddress);
        });
    }
    
}

function createNode(host) {
    if (nodes[host])
        return nodes[host];
        
    var node = new Node(host);
    
    nodes[host] = node;
    
    return node;
}

module.exports = {
    node: createNode
}

