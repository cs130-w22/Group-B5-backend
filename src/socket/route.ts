import { app } from '../index';
import { Tracker } from './tracker';
import { Socket } from 'socket.io';
//import * as socketioJwt from 'socketio-jwt';

let io = app.get('socketio');
const privateKey = 'xEyduBGd5cHEbR58MNphCC2h0AgzjnCFr8UTMrjCZhl387p8I6MjFAR7szTFSw1';

// singleton
let tracker = new Tracker();

/*
io.of("/race/private").on("connection", socketioJwt.authorize({
	secret: privateKey,
	timeout: 15000
})).on('authenticated', (socket) => {
*/
io.of("/race/private").on("connection", (socket) => {
	socket.emit("connected", "connection successful");

	// create new private lobby
	socket.on("create", (difficulty) => {
		let code = tracker.createLobby(difficulty);
		socket.join(code);
		socket.emit("lobby", code);	
	});

	// join an existing lobby
	socket.on("join", (code) => {
		let opponent = tracker.findLobby(code);

		// invalid code given
		if(!opponent) {
			socket.emit("error", "lobby code not found");
		} else {
			// put this socket in a room with the lobby creator's socket
			io.of("/race/private").to(code).emit("lobby", "new user joining lobby");
			socket.join(code);
			socket.emit("lobby", "successfully joined lobby");
		}
	});

	// start race
	socket.on("start", (code) => {
		if(tracker.start(code)) {
			io.of("/race/private").to(code).emit("race", "race starting");
		};
	});
});
