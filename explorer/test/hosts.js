
var config = require('../config.json');
var hosts = require('../lib/hosts');

exports['get current host'] = function (test) {
    var host = hosts.current();
    
    test.ok(host);
    test.equal(host, config.host);
}

exports['set and get current host'] = function (test) {
    hosts.current('localhost:4445');
    var host = hosts.current();
    
    test.ok(host);
    test.equal(host, 'localhost:4445');
}

