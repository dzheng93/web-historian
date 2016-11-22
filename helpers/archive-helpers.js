var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  index: path.join(__dirname, '../web/public/index.html'),
  loadingHTML: path.join(__dirname, '../web/public/loading.html'),
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  indexToStartArchiving: path.join(__dirname, '../workers/indexToStartArchiving.txt'),
  fetcherLog: path.join(__dirname, '../workers/fetcherLog.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(error, data) {
    var sitesArr = data.split('\n');
    // Last element is empty string, remove it:
    sitesArr.pop();
    callback(sitesArr);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(sitesArr) {
    var inList = true;
    if (sitesArr.indexOf(url) === -1) {
      var inList = false;
    }
    callback(inList);
  });

};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, function(err) {
    var exists = err ? false : true;
    callback(exists);
  });
};

exports.downloadUrls = function(urlArr) {
  urlArr.forEach(function(url) {
    console.log('Will download: http://' + url);
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url, {defaultEncoding: 'utf8'}));
  });

};

