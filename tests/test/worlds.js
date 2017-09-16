
var worlds = require('../lib/worlds');

exports['create world'] = function (test) {
	var world = worlds.world();
	
	test.ok(world);
	test.equal(typeof world, 'object');
};

