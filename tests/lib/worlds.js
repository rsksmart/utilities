
function World() {
	this.variable = function () {};
}

function createWorld() {
	return new World();
}

module.exports = {
	world: createWorld
};

