import { app } from '../index';
import { Tracker } from './tracker';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

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
		if(difficulty == "easy" || difficulty == "medium" || difficulty == "hard") {
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
		if(await tracker.start(code)) {
			io.of("/race/private").to(code).emit("start", "race starting");
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
