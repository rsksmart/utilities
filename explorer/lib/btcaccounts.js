
var accounts = [];
var maxid = 0;

function createAccount(data) {
    var id = ++maxid;
    var account = { 
        id: id
    };
    
    for (var n in data)
        account[n] = data[n];
    
    accounts[id] = account;
    
    return id;
}

function getAccountById(id) {
    return accounts[id];
}

function getAccounts() {
    var result = [];
    
    for (var n in accounts)
        result.push(accounts[n]);
        
    return result;
}

module.exports = {
    create: createAccount,
    getById: getAccountById,
    getList: getAccounts
}
