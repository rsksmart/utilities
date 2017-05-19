
var snodes = require('../lib/nodes');
var sblocks = require('../lib/blocks');
var shosts = require('../lib/hosts');

function getBlock(req, res) {
    var id = req.params.id;
    var block = sblocks.getBlock(id);
    
    console.dir(block);
    
    res.render('blockview', { block: block });
}

function getBlocks(req, res) {
    var node = snodes.node(shosts.current());
    var block = node.getBlock('latest');
    sblocks.retrieveBlocks(node);
    
    var blocks = [];
    
    if (block)
        blocks.push(block);
    
    setTimeout(function () {
        while (block && block.number) {
            block = sblocks.getBlock(block.parentHash);
            
            if (block)
                blocks.push(block);
        }
        
        res.render('blocklist', { blocks: blocks });
    }, 10000);
}

module.exports = {
    getBlocks: getBlocks,
    getBlock: getBlock
};