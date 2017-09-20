
function repeatFunction(fn, ntimes, cb) {
	if (ntimes <= 0)
		return cb(null, null);
	
	fn(function (err, data) {
		if (err)
			return cb(err);
		
		setTimeout(function () {
			repeatFunction(fn, ntimes - 1, cb);
		}, 0);
	});
}

module.exports = {
	repeat: repeatFunction
};

