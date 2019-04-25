var express 		    = 	require('express');
var path 			      =	  require('path');
var cookieParser 	  = 	require('cookie-parser');
var logger 			    = 	require('morgan');
var cors 			      = 	require('cors');
var app 			      = 	express();
var mongoose 		    = 	require('mongoose');
var http 			      =	  require('http').Server(app);
var io				      =	  require('socket.io')(http);

require('./socket')(io);
require('./passport');
require('dotenv').config();



var routes = require('./routes/route');


mongoose.connect('mongodb://localhost/management');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var allSockets = [];

http.listen(3000, function() {
  console.log("listening");
});

module.exports = {
	app:	app,
	io: io
}
