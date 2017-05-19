
var saccounts = require('../lib/accounts');
var sbtcaccounts = require('../lib/btcaccounts');
var stransactions = require('../lib/transactions');
var snodes = require('../lib/nodes');
var shosts = require('../lib/hosts');

function getNode() {
    return snodes.node(shosts.current());
}

function getAccounts(req, res) {
    var accounts = saccounts.getList();
    
    res.render('accountlist', { 
        accounts: accounts
    }); 
}

function getAccount(req, res) {
    var id = req.params.id;
    
    if (id.length < 10) {
        id = parseInt(id);
        var account = saccounts.getById(id);
    }
    else {
        var account = saccounts.getByPublicKey(id);
        
        if (!account) {
            account = { publicKey: saccounts.normalizePublicKey(id) };
            saccounts.create(account);
        }
    }
    
    if (account.publicKey)
        account.balance = getNode().getBalance(account.publicKey);
    
    res.render('accountview', { 
        account: account
    }); 
}

function getTransactions(req, res) {
    var id = req.params.id;
        
    res.render('accounttxlist', { 
        address: id,
        transactions: stransactions.getTransactionsByAccount(id)
    }); 
}

function newAccount(req, res) {
    res.render('accountnew', { 
    }); 
}

function addAccount(req, res) {
    var entity = getEntity(req);
    
    if (!entity.publicKey && !entity.privateKey)
        entity.privateKey = saccounts.generateKey();
    
    if (!entity.publicKey && entity.privateKey) {
        var node = getNode();
        
        node.importKey(entity.privateKey, function (err, key) {
            if (err)
                return res.render('error', { message: err });
            entity.publicKey = key;
            saccounts.create(entity);
            
            getAccounts(req, res);
        });
        
        return;
    }
    
    var id = saccounts.create(entity);
    
    getAccounts(req, res);
}

function newTransfer(req, res) {
    var id = req.params.id;
    
    var account = saccounts.getByPublicKey(id);
    
    var accounts = saccounts.getList();
    
    var accs = [];
    
    accounts.forEach(function (account) {
        var description = account.publicKey;
        
        if (account.name)
            description += " (" + account.name + ")";
        
        var acc = { id: account.publicKey, description: description } 
        
        accs.push(acc);
    });

    res.render('transfernew', { 
        from: account,
        accounts: accs
    }); 
}

function sendTransfer(req, res) {
    var from = req.params.id;
    var to = req.param('to');
    var value = parseInt(req.param('amount'));
    var gasPrice = 1;
    var gas = 1000000;
    
    var tx = {
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    };
    
    getNode().sendTransaction(tx);
    
    getAccount(req, res);
}

function newBtcTransfer(req, res) {
    var id = req.params.id;
    
    var account = saccounts.getByPublicKey(id);
    
    var accounts = sbtcaccounts.getList();
    
    var accs = [];
    
    accounts.forEach(function (account) {
        var acc = { id: account.id, description: account.name } 
        
        accs.push(acc);
    });

    res.render('btctransfernew', { 
        from: account,
        accounts: accs
    }); 
}

function sendBtcTransfer(req, res) {
    var from = req.params.id;
    var to = parseInt(req.param('to'));
    var btcaccount = sbtcaccounts.getById(to);
    var value = parseInt(req.param('amount'));
    var gasPrice = 1;
    var gas = 1000000;
    
    var tx = {
        from: from,
        to: "0x0000000000000000000000000000000000000006",
        value: value,
        gasPrice: gasPrice,
        gas: gas,
        data: btcaccount.bridgeData
    };
    
    getNode().sendTransaction(tx);
    
    getAccount(req, res);
}

function getEntity(req) {
    var entity = { };
    
    entity.name = req.param('name');
    
    if (req.param('pubkey'))
        entity.publicKey = req.param('pubkey');
    if (req.param('privkey'))
        entity.privateKey = req.param('privkey');
    
    return entity;
}

module.exports = {
    getAccounts: getAccounts,
    getAccount: getAccount,
    getTransactions: getTransactions,
    newAccount: newAccount,
    addAccount: addAccount,
    newTransfer: newTransfer,
    sendTransfer: sendTransfer,
    newBtcTransfer: newBtcTransfer,
    sendBtcTransfer: sendBtcTransfer
}

