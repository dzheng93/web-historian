var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

//---------------------------------------------------------------
//           Print time stamp to log at start of run
//---------------------------------------------------------------

var timeStr = new Date().toLocaleTimeString();
var logStr = 'htmlFetcher started at: ' + timeStr;
fs.appendFile(archive.paths.fetcherLog, logStr, function(err) {
});


//---------------------------------------------------------------
//             Fetch Sites Promise Functions
//---------------------------------------------------------------

var downloadNewSites = function(sitesArr) {
  return new Promise(function(resolve, reject) {
    var sitesDownloading = [];
    sitesArr.forEach(function(site, index) {
      if (index >= archiveStartIndex) {
        sitesDownloading.push(site);
        archive.downloadUrls([site]);
      }
    });
    var fetchState = {
      sitesDownloading: sitesDownloading,
      nextIndexDownload: sitesArr.length
    };
    resolve(fetchState);
  });
};

var logger = function(fetchState) {
  return new Promise(function(resolve, reject) {
    var logOutput = '\nDownloading sites: ' + fetchState.sitesDownloading.join(', ') + '\n----------------------------\n';
    fs.appendFile(archive.paths.fetcherLog, logOutput, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(fetchState);
      }
    });
  });
};

var updateArchiveStartIndex = function(fetchState) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(archive.paths.indexToStartArchiving, JSON.stringify(fetchState.nextIndexDownload), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//---------------------------------------------------------------
//                      RUN PROGRAM
//---------------------------------------------------------------

var archiveStartIndex;

fs.readFileAsync(archive.paths.indexToStartArchiving, 'utf-8')
.then(function(data) {
  archiveStartIndex = JSON.parse(data);
  console.log('indexToStart Archiving:', archiveStartIndex);
  return;
})
.then(archive.readListOfUrls)
.then(downloadNewSites)
.then(logger)
.then(updateArchiveStartIndex);





