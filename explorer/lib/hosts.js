
var config = require('../config.json');

var host = config.host;

function currentHost(newhost) {
    if (!newhost)
        return host;
        
    host = newhost;
    
    return host;
}

module.exports = {
    current: currentHost
};