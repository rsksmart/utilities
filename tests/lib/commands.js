
function TransferCommand(cmd, world) {
	this.execute = function (txdata, cb) {
		var data = {
			from: txdata.from,
			to: txdata.to,
			value: txdata.value,
			gasPrice: 1,
			gas: 21000
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

