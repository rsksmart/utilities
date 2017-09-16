
function World() {
	var variables = {};
	
	this.variable = function (name, value) {
		if (value === undefined)
			return variables[name];
		
		variables[name] = value;
	};
}

function createWorld() {
	return new World();
}

module.exports = {
	world: createWorld
};

