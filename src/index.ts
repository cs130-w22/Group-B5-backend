const express = require('express');
const bodyParser = require('body-parser');
const loginRouter = require('./routes/login');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use('/login', loginRouter);

// start server on port
const PORT = 8080
let server = app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});

module.exports = app;
