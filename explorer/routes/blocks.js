var express = require('express');
var router = express.Router();
var cblocks = require('../controllers/blocks');

router.get('/', cblocks.getBlocks);
router.get('/:id', cblocks.getBlock);

module.exports = router;

