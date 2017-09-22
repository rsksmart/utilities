
var utils = require('../lib/utils');

exports['encode decode integer value'] = function (test) {
    var encoded = utils.encodeValue(42);
    var result = utils.decodeValue(encoded);
    
    test.equal(result, 42);
}

