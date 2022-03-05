import { app } from '../index';
import { Tracker } from './tracker';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import Problem from '../lib/problem';
import Submission from '../lib/submission'
import {SubmissionStatus } from '../utils/interfaces';
require("dotenv").config();

let io = app.get('socketio');
const privateKey = process.env.PRIVATE_KEY;

// singleton
let tracker = new Tracker();

// authenticate jwt
io.use(function(socket, next) {
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

	// search for random opponent
	socket.on("search", async (difficulty) => {
		console.log(`${socket.decoded.user} is searching for an opponent with '${difficulty}' difficulty`)
		if(difficulty !== "Any" && difficulty !== "Easy" && difficulty !== "Medium" && difficulty !== "Hard") {
			socket.emit("error", "invalid difficulty");
			return;
		}

		let res = await tracker.search(difficulty);
		let code = res[0];
		let found = res[1]
		socket.join(code);
		if(!found) {
			console.log("no opponent found")
			socket.emit("searching", code);
		} else {
			console.log("opponent found")
			io.to(code).emit("match", code);
			
			let prob = tracker.getRaceProblem(code)
			if(prob){
				const problem_details: any = {};
				problem_details.slug = prob.slug;
				problem_details.title = prob.title,
				problem_details.content = prob.content,
				// array of dictionaries {"lang": xxx, "langSlug": xxx, "code": xxx}
				problem_details.code = prob.codeSnippets

				io.to(code).emit("start", JSON.stringify(problem_details), code);
			} else {
				socket.emit("error", "An error occurred. Could not start the random-matchmaking race. Please try again");
			}
		}
	});

	// cancel searching for opponent
	socket.on("cancel", (code) => {
		console.log(`${socket.decoded.user} has canceled their search`)
		tracker.cancelSearch(code);
		socket.emit("cancelled");
	});

	// create new private lobby
	socket.on("create", (difficulty) => {
		if(difficulty === "Any" || difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") {
			let code = tracker.createLobby(difficulty);
			console.log(`${socket.decoded.user} just created a lobby with code ${code}`)
			socket.join(code);
			socket.emit("create", code);	
		} else {
			socket.emit("error", "invalid difficulty");
		}
	});

	// join an existing lobby
	socket.on("join", async (code) => {
		console.log(`${socket.decoded.user} just joined lobby with code ${code}`)
		let opponent = tracker.findLobby(code);

		// invalid code given
		if(!opponent) {
			socket.emit("error", "lobby code not found");
		} else {
			// put this socket in a room with the lobby creator's socket
			socket.join(code);
			let sockets = await io.in(code).fetchSockets();
			let players = sockets.map(s => s.decoded.user)

			console.log(`Players in ${code}: ${players}`)
			io.to(code).emit("join", `new user ${socket.decoded.user} joining lobby`, players);;
		}
	});

	// leave lobby
	socket.on("leave", async (code) => {
		console.log(`${socket.decoded.user} just left lobby ${code}`)
		socket.leave(code);		
		socket.emit("leave", "successfully left lobby");

		let sockets = await io.in(code).fetchSockets();
		let players = sockets.map(s => s.decoded.user)
		io.to(code).emit("leave", `User ${socket.decoded.user} left lobby`, players);

		if(players.length === 0){
			tracker.removeRace(code)
		}
	});

	// start race
	socket.on("start", async (code) => {
		console.log(`${socket.decoded.user} just started race ${code}`)
		await startRace(code, socket);
	});

	// submit code
	socket.on("submit", async (code, lang_slug, solution) => {
		console.log(`${socket.decoded.user} just submitted their code in ${code}`)
		console.log(`Submitted code: ${solution}`)
		const problem = tracker.getRaceProblem(code);

		if (problem) {
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
			console.log("Submission data:", submission)

			const notification: any = {};
			notification.status = submission.status;
			notification.total_correct = submission.total_correct;
			notification.total_testcases = submission.total_testcases;
			notification.username = socket.decoded.user
			io.to(code).emit("notification", JSON.stringify(notification));

			const submission_details: any = {}
			submission_details.memory = submission.memory;
			submission_details.runtime = submission.runtime;
			submission_details.status = submission.status;
			submission_details.code_output = submission.code_output;
			submission_details.compile_error = submission.compile_error;
			submission_details.runtime_error = submission.runtime_error;
			submission_details.total_correct = submission.total_correct;
			submission_details.total_testcases = submission.total_testcases;
			submission_details.input = submission.input;
			submission_details.expected_output = submission.expected_output;

			socket.emit("submission", JSON.stringify(submission_details));

			// if submission is correct, update user stats
			// and emit "win" event containing username of winner
			if(submission.status === SubmissionStatus["Accepted"]) {
				console.log(`${socket.decoded.user} just passed all testcases and won race ${code}`)
				let players = await io.in(code).fetchSockets();
				let winner = socket.decoded["user"];
				let race = tracker.findRace(code);
				
				io.to(code).emit("win", winner);
				
				await race.end(winner, players);

				// remove race from tracker
				tracker.removeRace(code);	
			}

		} else {
			socket.emit("error", "invalid room code");
		}
	});
});

async function startRace(code: string, socket: Socket) {
	const problem = await tracker.start(code);

	if(problem) {

		const problem_details: any = {};
		problem_details.slug = problem.slug;
		problem_details.title = problem.title,
			problem_details.content = problem.content,
			// array of dictionaries {"lang": xxx, "langSlug": xxx, "code": xxx}
			problem_details.code = problem.codeSnippets

		io.to(code).emit("start", JSON.stringify(problem_details), code);
	} else {
		socket.emit("error", "invalid room code");
	}
}
