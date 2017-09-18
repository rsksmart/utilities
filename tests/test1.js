
var rskapi = require('rskapi');
var async = require('simpleasync');

var host = rskapi.host('http://localhost:4444');

function getAccounts(cb) {
	host.getAccounts(cb);
}

async()
	.exec(function (next) {
		getAccounts(next);
	})
	.then(function (data, next) {
		console.dir(data);
	})
	.error(function (err) {
		console.log(err);
	});
