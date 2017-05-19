var express = require('express');
var router = express.Router();
var caccounts = require('../controllers/accounts');

/* GET home page. */
router.get('/', caccounts.getAccounts);
router.get('/new', caccounts.newAccount);
router.post('/new', caccounts.addAccount);
router.get('/:id', caccounts.getAccount);
router.get('/:id/tx', caccounts.getTransactions);
router.get('/:id/transfer', caccounts.newTransfer);
router.post('/:id/transfer', caccounts.sendTransfer);
router.get('/:id/btctransfer', caccounts.newBtcTransfer);
router.post('/:id/btctransfer', caccounts.sendBtcTransfer);

module.exports = router;


