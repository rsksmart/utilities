var express = require('express');
var router = express.Router();
var cassets = require('../controllers/assets');

router.get('/', cassets.getAssets);
router.get('/new', cassets.newAsset);
router.get('/:id', cassets.getAsset);
router.post('/new', cassets.addAsset);
router.get('/:id/balance', cassets.getBalances);
router.get('/:id/transfer', cassets.newTransfer);
router.post('/:id/transfer', cassets.sendTransfer);

module.exports = router;

