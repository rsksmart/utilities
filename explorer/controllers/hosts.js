
var shosts = require('../lib/hosts');

function getHost(req, res) {
    var host = shosts.current();
    
    res.render('hostview', { 
        host: host
    }); 
}

function updateHost(req, res) {
    var host = req.param('host');
    
    shosts.current(host);
    
    getHost(req, res);
}

module.exports = {
    getHost: getHost,
    updateHost: updateHost
}

