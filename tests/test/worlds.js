
var worlds = require('../lib/worlds');

exports['create world'] = function (test) {
	var world = worlds.world();
	
	test.ok(world);
	test.equal(typeof world, 'object');
};

exports['get undefined variable'] = function (test) {
	var world = worlds.world();
	
	test.equal(world.variable('foo'), null);
};

exports['set and get variable'] = function (test) {
	var world = worlds.world();
	
	world.variable('answer', 42);
	test.equal(world.variable('answer'), 42);
};

exports['get undefined account'] = function (test) {
	var world = worlds.world();
	
	test.equal(world.account('foo'), null);
};

exports['set and get account'] = function (test) {
	var world = worlds.world();
	
	world.account('account', 42);
	test.equal(world.account('account'), 42);
};

exports['set and get server'] = function (test) {
	var world = worlds.world();
	
	var server = {};
	
	world.server(server);
	test.strictEqual(world.server(), server);
};

