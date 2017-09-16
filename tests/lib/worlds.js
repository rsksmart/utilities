
function World() {
	var variables = {};
	var accounts = {};
	
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
}

function createWorld() {
	return new World();
}

module.exports = {
	world: createWorld
};

