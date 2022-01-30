const express = require('express');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use('/login', loginRoute);
app.use('/signup', signupRoute);

// start server on port
const PORT = 8080
let server = app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});

module.exports = app;
