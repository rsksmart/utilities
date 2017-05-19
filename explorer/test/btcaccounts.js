
var accounts = require('../lib/btcaccounts');
var sl = require('simplelists');

exports['create and retrieve account'] = function (test) {
    var id = accounts.create({ name: 'Account 1' });
    
    test.ok(id);
    
    var account = accounts.getById(id);
    
    test.ok(account);
    test.equal(account.id, id);
    test.equal(account.name, 'Account 1');
};

exports['create a second account and retrieve accounts'] = function (test) {
    var id = accounts.create({ name: 'Account 2' });
    
    test.ok(id);
    
    var accs = accounts.getList();
    
    test.ok(accs);
    test.ok(Array.isArray(accs));
    test.ok(sl.exist(accs, { name: 'Account 1' }));
    test.ok(sl.exist(accs, { name: 'Account 2' }));
};

