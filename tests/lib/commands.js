
function TransferCommand(cmd, world) {
	this.execute = function (cb) {
		var data = {
			from: cmd.from,
			to: cmd.to,
			value: cmd.value,
			gasPrice: cmd.gasPrice || 1,
			gas: cmd.gas || 21000
		};
		
		world.server().sendTransfer(data, cb);
	}
}

function createCommand(cmd, world) {
	if (cmd.command === 'transfer')
		return new TransferCommand(cmd, world);
}

module.exports = {
	command: createCommand
};

