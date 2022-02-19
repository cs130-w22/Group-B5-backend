import { app } from '../index';
import { Tracker } from './tracker';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import Problem from '../lib/problem';
import Submission from '../lib/submission'
import {SubmissionStatus } from '../utils/interfaces';

let io = app.get('socketio');
const privateKey = 'xEyduBGd5cHEbR58MNphCC2h0AgzjnCFr8UTMrjCZhl387p8I6MjFAR7szTFSw1';

// singleton
let tracker = new Tracker();

// authenticate jwt
io.of("/race/private").use(function(socket, next) {
	if(socket.handshake.auth && socket.handshake.auth.token) {
		jwt.verify(socket.handshake.auth.token, privateKey, function(err, decoded) {
			if(err) return next(new Error("Authentication failed"));
			socket.decoded = decoded;
			next();
		});
	}
	else {
		next(new Error("Authentication failed"));
	}
})
.on("connection", (socket) => {

	socket.emit("connected", "connection successful");

	// create new private lobby
	socket.on("create", (difficulty) => {
		if(difficulty == "Any" || difficulty == "Easy" || difficulty == "Medium" || difficulty == "Hard") {
			let code = tracker.createLobby(difficulty);
			socket.join(code);
			socket.emit("create", code);	
		} else {
			socket.emit("error", "invalid difficulty");
		}
	});

	// join an existing lobby
	socket.on("join", (code) => {
		let opponent = tracker.findLobby(code);

		// invalid code given
		if(!opponent) {
			socket.emit("error", "lobby code not found");
		} else {
			// put this socket in a room with the lobby creator's socket
			io.of("/race/private").to(code).emit("join", "new user joining lobby", socket.decoded["user"]);
			socket.join(code);
			socket.emit("join", "successfully joined lobby");
		}
	});

	// start race
	socket.on("start", async (code) => {

		const problem = await tracker.start(code);

		if(problem != null) {
			const problem_details:JSON = <JSON><unknown>{

				//unique identifier used to submit code
				"slug": problem.slug,
        		"title": problem.title,

				//description of problem
        		"content": problem.content,

				// array of dictionaries {"lang": xxx, "langSlug": xxx, "code": xxx}
				"code": problem.codeSnippets
			  }

			io.of("/race/private").to(code).emit("start", problem_details);
		} else {
			socket.emit("error", "invalid room code");
		}
	});

	// submit code
	socket.on("submit", async (code, lang_slug, solution) => {
		const problem = tracker.getRaceProblem(code);

		if (problem != null) {
			const submission: Submission = await problem.submit(lang_slug, solution);
    
    		// leetcode may take a while to actually compute the results of a submission
    		// periodically checks leetcode to see if submission results are ready
    		for (let i = 0; i < 10; i++) {

        		// timeout two seconds
        		await new Promise(r => setTimeout(r, 2000));
        		await submission.detail()

        		// if the submission is ready, break the loop
        		if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
            		break;
        		}
    		}

			const submission_details:JSON = <JSON><unknown>{
		        "memory": submission.memory,
        		"runtime": submission.runtime,
        		"status": submission.status,
		        "code_output": submission.code_output,
        		"compile_error": submission.compile_error,
        		"runtime_error": submission.runtime_error,
        		"total_correct": submission.total_correct,
        		"total_testcases": submission.total_testcases,
        		"input" : submission.input,
        		"expected_output": submission.expected_output,
			  }
			io.of("/race/private").to(code).emit("submit", submission_details);
		} else {
			socket.emit("error", "invalid room code");
		}
		
	});

	// leave lobby
	socket.on("leave", (code) => {
		socket.leave(code);		
		socket.emit("leave", "successfully left lobby");
		io.of("/race/private").to(code).emit("leave", "user left lobby", socket.decoded["user"]);
	});
});
