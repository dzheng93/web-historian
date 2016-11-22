var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var sendStatic = function(res, asset, statusCode) {
    httpHelpers.serveAssets(res, asset, function(err, data) {
      res.writeHead(statusCode, httpHelpers.headers);
      res.end(data);
    });
  };


  var statusCode;

  if (req.method === 'GET') {
    if (req.url === '/') {
      sendStatic(res, 'index', 200);
    } else {
      var siteUrl = req.url;
      archive.isUrlArchived(siteUrl, function(exists) {
        // If query URL is archived => serve it, else 404
        if (exists) {
          sendStatic(res, siteUrl, 200);
        } else {
          statusCode = 404;
          res.writeHead(statusCode, httpHelpers.headers);
          res.end(JSON.stringify(''));
        }
      }); 
    }
  } else if (req.method === 'POST') {
    statusCode = 302;
    req.on('data', function(data) {
      var url = data.toString('utf8').slice(4);
      archive.isUrlInList(url, function(inList) {
        if (inList) {
          // Should prob check if URL has actually been archived yet
          res.setHeader('Location', '/' + url);
          res.writeHead(statusCode, httpHelpers.headers);
          res.end();
        // Website is not in our list
        } else {
          archive.addUrlToList(url, function() {});
          sendStatic(res, 'loadingHTML', 302);
        }
      });
    });
  } else {
    statusCode = 404;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end(JSON.stringify(''));
  }
};
