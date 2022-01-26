var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db');

var loginRouter = require('./routes/login');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use('/login', loginRouter);

// connect to mongoDB on startup
mongoose.connect('mongodb://127.0.0.1:27017/leetracerDB');

// start server on port
const PORT = 8080
var server = app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});

module.exports = app;
