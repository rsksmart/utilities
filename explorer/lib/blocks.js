
var blocks = {};

var stransactions = require('./transactions');
var snodes = require('./nodes');
var shosts = require('./hosts');

function getBlock(id) {
    if (!blocks[id])
        retrieveBlocks(snodes.node(shosts.current()), id);
    
    return blocks[id];
}

function saveBlock(block) {
    blocks[block.number] = block;
    blocks[block.hash] = block;
}

function retrieveTransactions(block, node) {
    if (!block || !block.transactions || !block.transactions.length)
        return;
    
    block.transactions.forEach(function (txhash) {
        stransactions.getTransaction(txhash, node, function (err, tx) {
            if (err)
                console.log('Error retrieving transaction', txhash, err);
            else
                console.log('Transaction', txhash);
        });
    });    
}

function retrieveBlocks(node, id) {
    if (!id)
        id = 'latest';
    
    getBlock(id);
    
    function getBlock(id) {
        if (blocks[id])
            return;
            
        node.getBlock(id, function (err, block) {
            if (err)
                return console.log('Error retrieving block', id, err);
                
            if (!block || !block.number)
                return;

            console.log('Block', block.number, id);
            saveBlock(block);
            retrieveTransactions(block, node);

            setTimeout(function () { getBlock(block.parentHash); }, 0);
        });
    }
}

module.exports = {
    getBlock: getBlock,
    retrieveBlocks: retrieveBlocks
}

