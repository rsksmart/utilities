
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
