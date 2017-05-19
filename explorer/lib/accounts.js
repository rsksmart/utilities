
var accounts = [];
var accpks = [];
var maxid = 0;

function generateByte() {
    var value = Math.floor(Math.random() * 256).toString(16);
    
    if (value.length < 2)
        value = '0' + value;
    
    return value;
}

function generateAccountKey() {
    var key = '';
    
    for (var k = 0; k < 20; k++)
        key += generateByte();
    
    return key;
}

function createAccount(data) {
    var id = ++maxid;
    var account = { 
        id: id
    };
    
    for (var n in data)
        account[n] = data[n];
    
    if (!account.publicKey)
        account.publicKey = generateAccountKey();
    
    if (account.publicKey)
        account.publicKey = normalizePublicKey(account.publicKey);
        
    accounts[id] = account;
    accpks[account.publicKey] = account;
    
    return id;
}

function getAccountById(id) {
    return accounts[id];
}

function getAccountByPublicKey(pk) {
    return accpks[normalizePublicKey(pk)];
}

function getAccounts() {
    var result = [];
    
    for (var n in accounts)
        result.push(accounts[n]);
        
    return result;
}

function normalizePublicKey(pk) {
    if (pk && pk.length >= 2 && pk[0] === '0' && pk[1] === 'x')
        return pk;
    
    return '0x' + pk;
}

module.exports = {
    create: createAccount,
    getById: getAccountById,
    getByPublicKey: getAccountByPublicKey,
    getList: getAccounts,
    generateKey: generateAccountKey,
    normalizePublicKey: normalizePublicKey
}
