
var contracts = require('../lib/contracts');

exports['compile contract'] = function (test) {
    var result = contracts.compileContract('token.solc', 'token');
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.ok(result.code);
    test.equal(typeof result.code, 'string');
    test.ok(result.abi);
    test.ok(Array.isArray(result.abi));
};

exports['save and get contract'] = function (test) {
    var result = contracts.compileContract('token.solc', 'token');
    contracts.saveContract('token', result);
    
    var contract = contracts.getContract('token');
    
    test.ok(contract);
    test.equal(contract, result);
};