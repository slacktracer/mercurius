'use strict';
var nodeStatic = require('node-static'),
    fileServer = new nodeStatic.Server({
        cache: false
    });
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8181, function onListening() {
    console.info('Server listening on port %d!', this.address().port);
});
