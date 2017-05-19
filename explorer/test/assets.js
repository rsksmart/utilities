
var assets = require('../lib/assets');
var sl = require('simplelists');

var assid1;
var assid2;

exports['create and retrieve asset'] = function (test) {
    var id = assets.create({ name: 'Account 1' });
    
    test.ok(id);
    
    assid1 = id;
    
    var asset = assets.getById(id);
    
    test.ok(asset);
    test.equal(asset.id, id);
    test.equal(asset.name, 'Account 1');
};

exports['create a second asset and retrieve assets'] = function (test) {
    var id = assets.create({ name: 'Account 2' });
    
    test.ok(id);
    
    assid2 = id;
    
    var accs = assets.getList();
    
    test.ok(accs);
    test.ok(Array.isArray(accs));
    test.ok(sl.exist(accs, { name: 'Account 1' }));
    test.ok(sl.exist(accs, { name: 'Account 2' }));
};

exports['update asset'] = function (test) {
    assets.update(assid1, { address: 'Address 1' });
    
    var asset = assets.getById(assid1);
    
    test.ok(asset);
    test.equal(asset.id, assid1);
    test.equal(asset.name, 'Account 1');
    test.equal(asset.address, 'Address 1');
}


