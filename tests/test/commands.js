
var commands = require('../lib/commands');
var worlds = require('../lib/worlds');

exports['create transfer command'] = function (test) {
	var cmd = commands.command({ command: 'transfer' });
	
	test.ok(cmd);
};

exports['execute transfer command'] = function (test) {
	test.async();
	
	var world = worlds.world();
	var invoked = false;
	
	var server = {
		sendTransfer: function (data, cb) {
			test.ok(data);
			test.equal(data.from, txcmd.from);
			test.equal(data.to, txcmd.to);
			test.equal(data.value, 100000);
			test.equal(data.gasPrice, 1);
			test.equal(data.gas, 21000);
			
			invoked = true;
			
			cb(null, null);
		}
	}
	
	world.server(server);
	
	var txcmd = {
		command: 'transfer',
		from: 'from',
		to: 'to',
		value: 100000
	};
	
	var cmd = commands.command(txcmd, world);
	
	test.ok(cmd);
	
	cmd.execute(function (err, data) {
		test.equal(err, null);
		test.ok(invoked);
		test.done();
	});
};

exports['execute transfer command with custom gas price and gas'] = function (test) {
	test.async();
	
	var world = worlds.world();
	var invoked = false;
	
	var server = {
		sendTransfer: function (data, cb) {
			test.ok(data);
			test.equal(data.from, txcmd.from);
			test.equal(data.to, txcmd.to);
			test.equal(data.value, txcmd.value);
			test.equal(data.gasPrice, txcmd.gasPrice);
			test.equal(data.gas, txcmd.gas);
			
			invoked = true;
			
			cb(null, null);
		}
	}
	
	world.server(server);
	
	var txcmd = {
		command: 'transfer',
		from: 'from',
		to: 'to',
		value: 100000,
		gasPrice: 2,
		gas: 42000
	};
	
	var cmd = commands.command(txcmd, world);
	
	test.ok(cmd);
	
	cmd.execute(function (err, data) {
		test.equal(err, null);
		test.ok(invoked);
		test.done();
	});
};



