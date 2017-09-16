
var commands = require('../lib/commands');

exports['create transfer command'] = function (test) {
	var cmd = commands.command({ command: 'transfer' });
	
	test.ok(cmd);
};



