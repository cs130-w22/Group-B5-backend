const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const leetcodeRoutes = require('./routes/leetcode');
import * as http from 'http';
import * as socketio from 'socket.io';
import { EndPoint } from './utils/interfaces';

import Leetcode from './lib/leetcode';
import LeetcodeProblems from './lib/LeetcodeProblems';

// connect socket.io
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('socketio', io);

// routers
app.use('/auth', authRoutes);
app.use('/leetcode', leetcodeRoutes);

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
const credit = {
	session: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzcwMTA5MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMmY5ZDIyNWUwYWMyYWU2OGJkMzYwZGU2NDllNmI4NzczN2FjMGJkNiIsImlkIjozNzAxMDkzLCJlbWFpbCI6Imxhd3JlbmNlZnVAdWNsYS5lZHUiLCJ1c2VybmFtZSI6ImxmdTciLCJ1c2VyX3NsdWciOiJsZnU3IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2xmdTcvYXZhdGFyXzE2MzE4MzUxMDIucG5nIiwicmVmcmVzaGVkX2F0IjoxNjQ0ODk3NjI3LCJpcCI6IjI2MDM6ODAwMTo2OTAxOjI1ODc6OTRiNjo0ZTM5OmY0MDg6YjRjOCIsImlkZW50aXR5IjoiM2U0ODlhYWMwZTQxMWQyNDJlNTUxNmVlZWY2ZGE0ZjIiLCJzZXNzaW9uX2lkIjoxODAzNjMyOSwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.gaBnZk1yGD03lJ5D8sI6miTw5z0KSmasCpFGCvnYRAM",
	csrfToken: "yHc8JsMPpa2aGkvYszthH5FNAGWtSm5evttyJZ7IbLyUN3FK7liRmfIhd1WjDGpS",
};
const endpoint = EndPoint["US"];
const leetcode = Leetcode.build2(credit, endpoint);

// getting all Leetcode Problems
(async () => {
	LeetcodeProblems.setLeetcode(leetcode);
    await LeetcodeProblems.setProblems();
})();
    

export { app };
