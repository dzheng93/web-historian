var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var statusCode;


  if (req.method === 'GET') {
    statusCode = 200;

    httpHelpers.serveAssets(res, 'index', function(err, data) {
      res.writeHead(statusCode, httpHelpers.headers);
      res.end(data);
    });
  } else if (req.method === 'POST') {
    statusCode = 201;
    req.on('data', function(data) {
      var url = data.toString('utf8').slice(4);

    
      res.writeHead(statusCode, httpHelpers.headers);

    });
  } else {
    statusCode = 404;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end(JSON.stringify(''));
  }



  

  // res.end(archive.paths.list);
};
