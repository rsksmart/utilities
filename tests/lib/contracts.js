
var solc = require('solc');
var fs = require('fs');

function findImports(path) {
	console.log('Import', path);
	return { contents: fs.readFileSync('./' + path).toString() };
    // return { error: 'File not found' }
}

function compileContract(name, filename) {
    console.log('compiling contract', name);
    var input = fs.readFileSync(filename).toString();
	var sources = {};
	sources[filename] = input;
    var output = solc.compile({ sources: sources }, 1, findImports); // 1 activates the optimiser

	return output.contracts[name];
}

function encodeArgument(arg) {
	var encoded = arg.toString(16);
	
	if (arg < 0)
		while (encoded.length < 64)
			encoded = 'f' + encoded;
	else
		while (encoded.length < 64)
			encoded = '0' + encoded;
}

function encodeArguments(args) {
	var result = '';
	
	args.forEach(function (arg) {
		result += encodeArgument(arg);
	});
	
	return result;
}

module.exports = {
	compile: compileContract,
	encodeArguments: encodeArguments
}

