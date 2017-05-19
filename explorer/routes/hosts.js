var express = require('express');
var router = express.Router();
var chosts = require('../controllers/hosts');

router.get('/', chosts.getHost);
router.post('/', chosts.updateHost);

module.exports = router;

