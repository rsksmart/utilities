
var commands = require('../lib/commands');
var worlds = require('../lib/worlds');

exports['create transfer command'] = function (test) {
	var cmd = commands.command({ command: 'transfer' });
	
	test.ok(cmd);
};

exports['execute transfer command'] = function (test) {
	test.async();
	
	var world = worlds.world();
	
	var server = {
		sendTransfer: function (data, cb) {
			test.ok(data);
			test.equal(data.from, txdata.from);
			test.equal(data.to, txdata.to);
			test.equal(data.value, 100000);
			test.equal(data.gasPrice, 1);
			test.equal(data.gas, 21000);
			
			cb(null, null);
		}
	}
	
	world.server(server);
	
	var cmd = commands.command({ command: 'transfer' }, world);
	
	test.ok(cmd);
	
	var txdata = {
		from: 'from',
		to: 'to',
		value: 100000     
	};
	
	cmd.execute(txdata, function (err, data) {
		test.equal(err, null);
		test.done();
	});
};



