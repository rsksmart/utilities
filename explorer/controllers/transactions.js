
var snodes = require('../lib/nodes');
var stransactions = require('../lib/transactions');
var shosts = require('../lib/hosts');

function getTransactions(req, res) {
    var txs = stransactions.getTransactions();
    
    res.render('transactionlist', { transactions: txs });
}

function getTransaction(req, res) {
    var id = req.params.id;
    var node = snodes.node(shosts.current());
    stransactions.getTransaction(id, node, function (err, data) {
        if (err)
            res.render('error', { message: err });
        else
            res.render('transactionview', { transaction: data });
    });
}

module.exports = {
    getTransactions: getTransactions,
    getTransaction: getTransaction
};