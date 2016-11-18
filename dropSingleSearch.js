var sys = require('util');
var exec = require('child_process').exec;
var AWS = require('aws-sdk');
var fileHelper = require('./fileHelper.js');
var fs = require('fs-extra');
var async = require('async');

var path = process.argv[2];

var searchDomain = process.env.AWS_CS_SEARCH;
var uploadDomain = process.env.AWS_CS_UPLOAD;
var aws_access_key = process.env.AWS_ACCESS_KEY_ID_IIGB_SEARCH_UPDATER;
var aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY_IIGB_SEARCH_UPDATER;


AWS.config.apiVersions = {
	cloudsearchdomain: '2013-01-01',
};

AWS.config.update({
	accessKeyId: aws_access_key,
	secretAccessKey: aws_secret_key,
	region: 'eu-west-1',
	correctClockSkew: true
});

var csdUpload = new AWS.CloudSearchDomain({
	endpoint: uploadDomain,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearch = new AWS.CloudSearchDomain({
	endpoint: searchDomain,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

async.parallel([
	function(callback) {
		async.waterfall([
			async.apply(getLatestDatabyLanguage, 'cn'),
			async.apply(removeData, 'cn')
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(getLatestDatabyLanguage, 'us'),
			async.apply(removeData, 'us')
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(getLatestDatabyLanguage, 'de'),
			async.apply(removeData, 'de')
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(getLatestDatabyLanguage, 'in'),
			async.apply(removeData, 'in')
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(getLatestDatabyLanguage, 'int'),
			async.apply(removeData, 'int')
		], function(err, result) {
			console.log(result);
		});
	}
], function(err, results) {
	if (err) {
		console.log(err);
	} else {
		console.log("search successfully dropped");
	}
});

function getLatestDatabyLanguage(language, callback) {
	var searchParams = {
		query: "(and (term field=language '" + language + "'))",
		queryParser: 'structured',
		size: 10000,
	};
	if (language == 'cn') {
		csdSearch.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'de') {
		csdSearch.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'us') {
		csdSearch.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'in') {
		csdSearch.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'int') {
		csdSearch.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	}
}

function removeData(language, data, callback) {

	var processedResults = addType(data, "delete");

	var batch = prepareBatch(processedResults);

	if (language == 'cn') {
		csdUpload.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping cn");
			callback(null, data);
		});
	} else if (language == 'de') {
		csdUpload.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping de");
			callback(null, data);
		});

	} else if (language == 'us') {
		csdUpload.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping us");
			callback(null, data);
		});
	} else if (language == 'in') {
		csdUpload.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping in");
			callback(null, data);
		});
	} else if (language == 'int') {
		csdUpload.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping int");
			callback(null, data);
		});
	}
}

function addType(results, action) {
	var processedResults = [];

	results.forEach(function(result) {
		delete result.fields;
		var jsonResult = {
			"id": result.id,
			"type": action
		};
		processedResults.push(jsonResult);
	});
	return JSON.stringify(processedResults);
}

function prepareBatch(results) {
	var params = {
		contentType: 'application/json',
		documents: results
	};
	return params;
}

function addTimestamp(params, callback) {

	var newDocs = JSON.parse(params.documents);
	var newParams = params;
	var array = [];

	for (var i = 0; i < newDocs.length; i++) {
		var url = newDocs[i].fields.url;
		console.log(newDocs[i]);
		newDocs[i].id = url + newDocs[i].fields.timestamp;
		array.push(newDocs[i]);
	}
	newParams.documents = JSON.stringify(array);
	return newParams;
}

function isIncluded(language) {
	if (languages.indexOf(language) != -1) {
		return true;
	} else {
		return false;
	}
}
