const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

import * as http from 'http';
import * as socketio from 'socket.io';
import { EndPoint } from './utils/interfaces';

import Leetcode from './lib/leetcode';
import LeetcodeProblems from './lib/LeetcodeProblems';

require("dotenv").config();

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


// initialize leetcode object
const session: string = process.env.LEETCODE_SESSION || "error";
const csrfToken: string = process.env.LEETCODE_CSRF || "error";
const credit = {
	session: session,
	csrfToken: csrfToken
};
const endpoint = EndPoint["US"];
const leetcode = Leetcode.build2(credit, endpoint);

// getting all Leetcode Problems
(async () => {
	LeetcodeProblems.setLeetcode(leetcode);
    await LeetcodeProblems.setProblems();
})();
    

export { app };
