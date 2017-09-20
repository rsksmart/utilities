
var solc = require('solc');
var fs = require('fs');
var utils = require('./utils');

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

function encodeCall(contract, fnsignature, args) {
	return contract.functionHashes[fnsignature] + utils.encodeArguments(args);
}

module.exports = {
	compile: compileContract,
	
	encodeCall: encodeCall
}

