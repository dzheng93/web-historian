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
    statusCode = 200;

    if (req.url === '/') {
      httpHelpers.serveAssets(res, 'index', function(err, data) {
        res.writeHead(statusCode, httpHelpers.headers);
        res.end(data);
      });
    } else {
      var siteUrl = req.url;
      archive.isUrlArchived(siteUrl, function(exists) {
        if (exists) {
          httpHelpers.serveAssets(res, siteUrl, function(err, data) {
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
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
        // Website is in our list:
        if (inList) {
          // Should prob check if URL has actually been archived yet
          res.setHeader('Location', '/' + url);
          res.writeHead(statusCode, httpHelpers.headers);
          res.end();
        // Website is not in our list
        } else {
          archive.addUrlToList(url, function() {});
          httpHelpers.serveAssets(res, 'loadingHTML', function(err, data) {
            res.writeHead(statusCode, httpHelpers.headers);
            res.end(data);
          });
        }
      });
    });
  } else {
    statusCode = 404;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end(JSON.stringify(''));
  }


};
