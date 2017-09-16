
function TransferCommand() {
	
}

function createCommand(cmd) {
	if (cmd.command === 'transfer')
		return new TransferCommand();
}

module.exports = {
	command: createCommand
};

