var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var path = require('path');

var fileHelper = {

	getFilesByType: function(files, extension) {
		var results = [];

		files.filter(function(file) {
				return file.substr(-5) === '.' + extension;
			})
			.forEach(function(file) {
				results.push(file);
			});
		return results;
	},

	createDirectories: function() {
		mkdirp('/tmp/cn/', function(err) {
			if (err) console.error(err);
			else console.log('/tmp/cn/ created');
		});
		mkdirp('/tmp/us/', function(err) {
			if (err) console.error(err);
			else console.log('/tmp/us/ created');
		});
		mkdirp('/tmp/de/', function(err) {
			if (err) console.error(err);
			else console.log('/tmp/de/ created');
		});
	},

	removeDirectories: function() {
		fs.remove('/tmp/us/', function(err) {
			if (err) throw err;
			console.log('removed temp dir');
		});
		fs.remove('/tmp/de/', function(err) {
			if (err) throw err;
			console.log('removed temp dir');
		});
		fs.remove('/tmp/cn/', function(err) {
			if (err) throw err;
			console.log('removed temp dir');
		});
	}
};

module.exports = fileHelper;
