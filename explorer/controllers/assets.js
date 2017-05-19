
var sassets = require('../lib/assets');
var scontracts = require('../lib/contracts');
var saccounts = require('../lib/accounts');
var snodes = require('../lib/nodes');
var shosts = require('../lib/hosts');
var config = require('../config.json');

function getNode() {
    return snodes.node(shosts.current());
}

function getAssets(req, res) {
    var assets = sassets.getList();
    
    res.render('assetlist', { 
        assets: assets
    }); 
}

function getAsset(req, res) {
    var id = parseInt(req.params.id);
    var asset = sassets.getById(id);
    
    res.render('assetview', { 
        asset: asset
    }); 
}

function newTransfer(req, res) {
    var id = parseInt(req.params.id);
    var asset = sassets.getById(id);
    var accounts = saccounts.getList();
    
    res.render('assettransfer', { 
        asset: asset,
        accounts: accounts
    }); 
}

function getBalances(req, res) {
    var id = parseInt(req.params.id);
    var asset = sassets.getById(id);
    var accounts = saccounts.getList();
    
    var balances = [];
    
    console.log('accounts');
    console.dir(accounts);

    accounts.forEach(function (account) {
        console.log('processing', account.name);
        
        var balance = {
            account: account,
            amount: 0
        };
        
        var amount = asset.contract['coinBalanceOf'].apply(asset.contract, ['0x' + account.publicKey]);
        
        console.log('amount', amount);
        balance.amount = amount;
        
        balances.push(balance);
    });
    
    res.render('assetbalances', {
        asset: asset,
        balances: balances
    }); 
}

function newAsset(req, res) {
    res.render('assetnew', { 
    }); 
}

function addAsset(req, res) {
    var entity = getEntity(req);
    
    var id = sassets.create(entity);
    
    var contract = scontracts.getContract(config.contract.name);
    var node = getNode();
    
    node.createContract(contract, function (err, data) {
        if (err) {
            console.log('Error creating contract', err);
            return;
        }
        
        sassets.update(id, data);
    });

    getAssets(req, res);
}

function sendTransfer(req, res) {
    var id = parseInt(req.params.id);
    var asset = sassets.getById(id);
    
    var fromid = parseInt(req.param('from'));
    var toid = parseInt(req.param('to'));
    var amount = parseInt(req.param('amount'));

    var fromacc = saccounts.getById(fromid);
    var toacc = saccounts.getById(toid);
    
    var args = [
        toacc.publicKey,
        amount,
        {
            from: fromacc.publicKey,
            gas: 1000000,
            gasPrice: 1
        }
    ];
    
    asset.contract['sendCoin'].apply(asset.contract, args);
    
    getAsset(req, res);
}

function getEntity(req) {
    var entity = { };
    
    entity.name = req.param('name');
    entity.notes = req.param('notes');
    
    if (req.param('address'))
        entity.address = req.param('address');
    
    return entity;
}

module.exports = {
    getAssets: getAssets,
    newAsset: newAsset,
    addAsset: addAsset,
    getAsset: getAsset,
    getBalances: getBalances,
    newTransfer: newTransfer,
    sendTransfer: sendTransfer
}

