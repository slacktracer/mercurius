/*jslint node: true */

'use strict';

var nodeStatic = require('node-static'),

    fileServer = new nodeStatic.Server('./public', {

        cache: false

    });

require('http').createServer(function (request, response) {

    request.addListener('end', function () {

        fileServer.serve(request, response);

    }).resume();

}).listen(8080, function onListening() {

    console.info('Server listening on port %d!', this.address().port);

});
