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

	createDirectories: function(language) {
		mkdirp('/tmp/' + language + '/', function(err) {
			if (err) console.error(err);
			else console.log('/tmp/' + language + '/ created');
		});
	},

	removeDirectories: function(language) {
		fs.remove('/tmp/' + language + '/', function(err) {
			if (err) throw err;
			console.log('removed temp ' + language + 'dir');
		});
	}
};

module.exports = fileHelper;
