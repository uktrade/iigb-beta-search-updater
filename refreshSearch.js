var sys = require('util');
var exec = require('child_process').exec;
var AWS = require('aws-sdk');
var fileHelper = require('./fileHelper.js');
var fs = require('fs-extra');
var async = require('async');

var path = process.argv[2];
var languages = process.argv[3].split(',');

var ignoredFolder = '/enquiries/';

var searchDomainIN = process.env.AWS_CS_SEARCH_IN_PROD;
var uploadDomainIN = process.env.AWS_CS_UPLOAD_IN_PROD;
var searchDomainINT = process.env.AWS_CS_SEARCH_INT_PROD;
var uploadDomainINT = process.env.AWS_CS_UPLOAD_INT_PROD;
var searchDomainCN = process.env.AWS_CS_SEARCH_CN_PROD;
var uploadDomainCN = process.env.AWS_CS_UPLOAD_CN_PROD;
var searchDomainDE = process.env.AWS_CS_SEARCH_DE_PROD;
var uploadDomainDE = process.env.AWS_CS_UPLOAD_DE_PROD;
var searchDomainUS = process.env.AWS_CS_SEARCH_US_PROD;
var uploadDomainUS = process.env.AWS_CS_UPLOAD_US_PROD;
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


var csdUploadIN = new AWS.CloudSearchDomain({
	endpoint: uploadDomainIN,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearchIN = new AWS.CloudSearchDomain({
	endpoint: searchDomainIN,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdUploadINT = new AWS.CloudSearchDomain({
	endpoint: uploadDomainINT,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearchINT = new AWS.CloudSearchDomain({
	endpoint: searchDomainINT,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});


async.parallel([
	function(callback) {
		if (isIncluded('cn')) {
			async.waterfall([
				async.apply(getCurrentData, 'cn'),
				getLatestVersion,
				async.apply(createJson, 'cn'),
				async.apply(getDatafromFile, 'cn'),
				async.apply(uploadNewIndex, 'cn'),
				async.apply(getLatestDatabyVersion, 'cn'),
				async.apply(removePreviousVersion, 'cn')
			], function(err, result) {
				console.log(result);
			});
		}
	},
	function(callback) {
		if (isIncluded('us')) {
			async.waterfall([
				async.apply(getCurrentData, 'us'),
				getLatestVersion,
				async.apply(createJson, 'us'),
				async.apply(getDatafromFile, 'us'),
				async.apply(uploadNewIndex, 'us'),
				async.apply(getLatestDatabyVersion, 'us'),
				async.apply(removePreviousVersion, 'us')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			});
		}
	},
	function(callback) {
		if (isIncluded('de')) {
			async.waterfall([
				async.apply(getCurrentData, 'de'),
				getLatestVersion,
				async.apply(createJson, 'de'),
				async.apply(getDatafromFile, 'de'),
				async.apply(uploadNewIndex, 'de'),
				async.apply(getLatestDatabyVersion, 'de'),
				async.apply(removePreviousVersion, 'de')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			});
		}
	},
	function(callback) {
		if (isIncluded('in')) {
			async.waterfall([
				async.apply(getCurrentData, 'in'),
				getLatestVersion,
				async.apply(createJson, 'in'),
				async.apply(getDatafromFile, 'in'),
				async.apply(uploadNewIndex, 'in'),
				async.apply(getLatestDatabyVersion, 'in'),
				async.apply(removePreviousVersion, 'in')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			});
		}
	},
	function(callback) {
		if (isIncluded('int')) {
			async.waterfall([
				async.apply(getCurrentData, 'int'),
				getLatestVersion,
				async.apply(createJson, 'int'),
				async.apply(getDatafromFile, 'int'),
				async.apply(uploadNewIndex, 'int'),
				async.apply(getLatestDatabyVersion, 'int'),
				async.apply(removePreviousVersion, 'int')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			});
		}
	}
], function(err, results) {
	if (err) {
		console.log(err);
	} else {
		console.log("search successfully refreshed");
	}
	// removeTempFiles();
});


function getCurrentData(language, callback) {

	var searchParams = {
		query: "(and (term field=language '" + language + "'))",
		queryParser: 'structured',
		size: 10000,
	};

	if (language == 'cn') {
		csdSearchCN.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data);
			}
		});
	} else if (language == 'de') {
		csdSearchDE.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data);
			}
		});

	} else if (language == 'us') {
		csdSearchUS.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data);
			}
		});
	} else if (language == 'in') {
		csdSearchIN.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data);
			}
		});
	} else if (language == 'int') {
		csdSearchINT.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data);
			}
		});
	}
}


function getLatestVersion(data, callback) {
	var version = 0;

	var searchData = data.hits.hit;

	for (i = 0; i < searchData.length; i++) {
		if (searchData[i].fields.timestamp > version) version = searchData[i].fields.timestamp;
	}
	console.log('The current latest version of the index is ' + version);
	callback(null, version);
}



function createJson(language, version, callback) {
	//create temp directory
	fileHelper.createDirectories();

	var child = exec("cs-import-documents --access-key " + aws_access_key + "  --secret-key " + aws_secret_key + " --source " + path + "/" + language + "/*/*/*/*/*.html " +
		path + "/" + language + "/*/*/*/*.html " + path + "/" + language + "/*/*/*.html " + path + "/" + language + "/*/*.html  --output /tmp/" + language + " --verbose");

	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.stderr.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.on('close', function(code) {
		console.log('closing code: ' + code);
		callback(null, version);
	});
}

function getDatafromFile(language, version, callback) {
	fs.readFile('/tmp/' + language + '/1.json', 'utf8', function(err, data) {
		if (err) {
			callback(err);
		} else {
			var searchdata = data;
			callback(null, searchdata, version);
		}
	});
}

function uploadNewIndex(language, newdata, version, callback) {

	var formattedData = prepareBatch(newdata);

	var indexedData = addTimestamp(formattedData);

	if (language == 'cn') {
		csdUploadCN.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new cn data to index");
			callback(null, version);
		});
	} else if (language == 'de') {
		csdUploadDE.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new de data to index");
			callback(null, version);
		});

	} else if (language == 'us') {
		csdUploadUS.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new us data to index");
			callback(null, version);
		});
	} else if (language == 'in') {
		csdUploadIN.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new us data to index");
			callback(null, version);
		});
	} else if (language == 'int') {
		csdUploadINT.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new us data to index");
			callback(null, version);
		});
	}

}

function getLatestDatabyVersion(language, version, callback) {
	var searchParams = {
		query: "(and (term field=timestamp '" + version + "'))",
		queryParser: 'structured',
		size: 10000,
	};
	if (language == 'cn') {
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
	} else if (language == 'us') {
		csdSearchUS.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'in') {
		csdSearchIN.search(searchParams, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			} else {
				callback(null, data.hits.hit);
			}
		});
	} else if (language == 'int') {
		csdSearchINT.search(searchParams, function(err, data) {
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
			else console.log("done removing previous version ");
			callback(null, data);
		});
	} else if (language == 'de') {
		csdUploadDE.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done removing previous version ");
			callback(null, data);
		});

	} else if (language == 'us') {
		csdUploadUS.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done removing previous version ");
			callback(null, data);
		});
	} else if (language == 'in') {
		csdUploadIN.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done removing previous version ");
			callback(null, data);
		});
	} else if (language == 'int') {
		csdUploadINT.uploadDocuments(batch, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done removing previous version ");
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

function pruneContent(results) {
	var prunedArray = [];

	results.forEach(function(result) {
		if ((result.fields.url).includes(ignoredFolder)) {
			console.log('pruning folders');
		} else {
			prunedArray.push(result);
		}
	});
	return prunedArray;
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
	var prunedArray = pruneContent(array);
	newParams.documents = JSON.stringify(prunedArray);
	return newParams;
}

function isIncluded(language) {

	if (languages.indexOf(language) !== -1) {
		return true;
	} else {
		return false;
	}
}
