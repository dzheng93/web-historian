var fs = require('fs');
var archive = require('../helpers/archive-helpers');


// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

fs.readFile(archive.paths.indexToStartArchiving, 'utf-8', function(err, data) {
  var archiveStartIndex = JSON.parse(data);
  console.log('indexToStart Archiving:', archiveStartIndex);

  archive.readListOfUrls(function(sitesArr) {
    sitesArr.forEach(function(site, index) {
      if (index >= archiveStartIndex) {
        archive.downloadUrls([site]);
      }
    });
    fs.writeFile(archive.paths.indexToStartArchiving, JSON.stringify(sitesArr.length), function(err) {
      // indexToStartArchiving is updated
    });
  });  
});



