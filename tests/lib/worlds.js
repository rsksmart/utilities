
function World() {
	var variables = {};
	var accounts = {};
	
	var server;
	
	this.variable = function (name, value) {
		if (value === undefined)
			return variables[name];
		
		variables[name] = value;
	};
	
	this.account = function (name, value) {
		if (value === undefined)
			return accounts[name];
		
		accounts[name] = value;
	};
	
	this.server = function (obj) {
		if (obj)
			server = obj;
		else
			return server;
	}
}

function createWorld() {
	return new World();
}

module.exports = {
	world: createWorld
};

