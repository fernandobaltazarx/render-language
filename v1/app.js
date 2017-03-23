
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");


/**
+Module dependencies
*/

var express = require('express');
var http = require('http');

var socket = require('./routes/socket.js');

var app = express();
var server = http.createServer(app);

/*Configuration*/
app.set('views','./views');
app.use(express.static('./public'));
var PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

/*Start server */
server.listen('3000', function() {
  console.log('Express server listening on port 3000 in %s mode', app.get('port'));
});

module.exports = app;
