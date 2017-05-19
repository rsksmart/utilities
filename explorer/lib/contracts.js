
var fs = require('fs');
var solc = require('solc');

var contracts = {};

function compileContract(filename, name) {
    console.log('compiling contract', filename);
    var input = fs.readFileSync(filename).toString();
    var output = solc.compile(input, 1); // 1 activates the optimiser
        
    var result = {
        code: output.contracts[name].bytecode,
        abi: JSON.parse(output.contracts[name].interface)
    };
    
    return result;
}

function saveContract(name, contract) {
    contracts[name] = contract;
}

function getContract(name) {
    return contracts[name];
}

module.exports = {
    compileContract: compileContract,
    saveContract: saveContract,
    getContract: getContract
};

