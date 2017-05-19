
var transactions = {};

function getTransactions() {
    var result = [];
    
    for (var n in transactions)
        result.push(transactions[n]);
    
    return result;
}

function getTransactionsByAccount(addr) {
    addr = normalizeHash(addr);

    var result = [];
    
    for (var n in transactions) {
        var tx = transactions[n];
        
        if (tx.to === addr || tx.from === addr)
            result.push(tx);
    }
    
    return result;
}

function getTransaction(hash, node, cb) {
    hash = normalizeHash(hash);
    
    if (transactions[hash])
        return cb(null, transactions[hash]);
    
    node.getTransaction(hash, function (err, tx) {
        if (!err && tx && tx.hash)
            transactions[tx.hash] = tx;
        
        cb(err, tx);
    });
}

function normalizeHash(hash) {
    if (hash && hash.length >= 2 && hash[0] === '0' && hash[1] === 'x')
        return hash;
    
    return '0x' + hash;
}

module.exports = {
    getTransactions: getTransactions,
    getTransactionsByAccount: getTransactionsByAccount,
    getTransaction: getTransaction
}

