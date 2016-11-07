var sys = require('util');
var exec = require('child_process').exec;
var AWS = require('aws-sdk');
var fileHelper = require('./fileHelper.js');
var fs = require('fs-extra');
var async = require('async');

var path = process.argv[2];
var languages = process.argv[3].split(',');

var searchDomainCN = process.env.AWS_CS_SEARCH_CN;
var uploadDomainCN = process.env.AWS_CS_UPLOAD_CN;
var searchDomainDE = process.env.AWS_CS_SEARCH_DE;
var uploadDomainDE = process.env.AWS_CS_UPLOAD_DE;
var searchDomainUS = process.env.AWS_CS_SEARCH_US;
var uploadDomainUS = process.env.AWS_CS_UPLOAD_US;
var aws_access_key = process.env.AWS_ACCESS_KEY_ID_IIGB_SEARCH;
var aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY_IIGB_SEARCH;



AWS.config.apiVersions = {
	cloudsearchdomain: '2013-01-01',
};

AWS.config.update({
	accessKeyId: aws_access_key,
	secretAccessKey: aws_secret_key,
	region: 'eu-west-1',
	correctClockSkew: true
});

var csdUploadCN = new AWS.CloudSearchDomain({
	endpoint: uploadDomainCN,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearchCN = new AWS.CloudSearchDomain({
	endpoint: searchDomainCN,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdUploadDE = new AWS.CloudSearchDomain({
	endpoint: uploadDomainDE,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearchDE = new AWS.CloudSearchDomain({
	endpoint: searchDomainDE,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdUploadUS = new AWS.CloudSearchDomain({
	endpoint: uploadDomainUS,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearchUS = new AWS.CloudSearchDomain({
	endpoint: searchDomainUS,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

console.log(isIncluded('de'));

async.parallel([
	function(callback) {
		if (isIncluded('cn')) {
			async.waterfall([
				async.apply(getLatestDatabyVersion, 'zh'),
				async.apply(removePreviousVersion, 'cn')
			], function(err, result) {
				console.log(result);
			});
		}
	},
	function(callback) {
		if (isIncluded('us')) {
			async.waterfall([
				async.apply(getLatestDatabyVersion, 'en'),
				async.apply(removePreviousVersion, 'en')
			], function(err, result) {
				console.log(result);
			});
		}
	},
	function(callback) {
		if (isIncluded('de')) {
			async.waterfall([
				async.apply(getLatestDatabyVersion, 'de'),
				async.apply(removePreviousVersion, 'de')
			], function(err, result) {
				console.log(result);
			});
		}
	}
], function(err, results) {
	if (err) {
		console.log(err);
	} else {
		console.log("search successfully dropped");
	}
});

function getLatestDatabyVersion(language, callback) {
	var searchParams = {
		query: "(and (term field=language '" + language + "'))",
		queryParser: 'structured',
		size: 10000,
	};
	if (language == 'zh') {
		csdSearchCN.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'de') {
		csdSearchDE.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'en') {
		csdSearchUS.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	}
}

function removePreviousVersion(language, data, callback) {

	var processedResults = addType(data, "delete");

	var batch = prepareBatch(processedResults);

	if (language == 'cn') {
		csdUploadCN.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping cn");
			callback(null, data);
		});
	} else if (language == 'de') {
		csdUploadDE.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping de");
			callback(null, data);
		});

	} else if (language == 'en') {
		csdUploadUS.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done dropping us");
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
