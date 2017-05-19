var express = require('express');
var router = express.Router();
var ctransactions = require('../controllers/transactions');

router.get('/', ctransactions.getTransactions);
router.get('/:id', ctransactions.getTransaction);

module.exports = router;

