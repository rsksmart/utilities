
var assets = [];
var maxid = 0;

function createAsset(data) {
    
    var id = ++maxid;
    
    var asset = { 
        id: id
    };
    
    for (var n in data)
        asset[n] = data[n];
        
    assets[id] = asset;
    
    return id;
}

function getAssetById(id) {
    return assets[id];
}

function getAssets() {
    var result = [];
    
    for (var n in assets)
        result.push(assets[n]);
        
    return result;
}

function updateAsset(id, data) {
    var asset = getAssetById(id);
    
    for (n in data)
        asset[n] = data[n];
}

module.exports = {
    create: createAsset,
    getById: getAssetById,
    getList: getAssets,
    update: updateAsset
}

