var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var timeStr = new Date().toLocaleTimeString();
var logStr = 'htmlFetcher started at: ' + timeStr;
var sitesDowloading = [];

fs.appendFile(archive.paths.fetcherLog, logStr, function(err) {
      // No callback
});

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

fs.readFile(archive.paths.indexToStartArchiving, 'utf-8', function(err, data) {
  var archiveStartIndex = JSON.parse(data);
  console.log('indexToStart Archiving:', archiveStartIndex);

  archive.readListOfUrls(function(sitesArr) {
    sitesArr.forEach(function(site, index) {
      if (index >= archiveStartIndex) {
        sitesDowloading.push(site);
        archive.downloadUrls([site]);
      }
    });
    var logOutput = '\nDownloading sites: ' + sitesDowloading.join(', ') + '\n----------------------------\n';
    fs.appendFile(archive.paths.fetcherLog, logOutput, function(err) {
      // No callback
    });
    fs.writeFile(archive.paths.indexToStartArchiving, JSON.stringify(sitesArr.length), function(err) {
      // indexToStartArchiving is updated
    });
  });  
});


