const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const leetcodeRoutes = require('./routes/leetcode');
const statsRoutes = require('./routes/stats');

import * as http from 'http';

// connect socket.io
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
	  origin: '*',
	}
});

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('socketio', io);

// routers
app.use('/auth', authRoutes);
app.use('/leetcode', leetcodeRoutes);
app.use('/stats', statsRoutes);

app.get("*", (res, next) => {
	res.status(404).send("Page not found")
})
	
app.use((error, req, res, next) => {
	return res.status(500).json({
		error: {
			message: error.message || "Something went wrong."
		}
	})
})

// start server on port
const PORT = 8080
server.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});

// require socket files 
app.locals.io = io;
const privateRace = require('./socket/route');

export { app };
