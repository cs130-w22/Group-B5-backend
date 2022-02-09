import { app } from '../../index';
import { PrivateLobbyTracker } from './tracker';
import { Socket } from 'socket.io';

let io = app.get('socketio');

// singleton
let tracker = new PrivateLobbyTracker();

io.of("/race/private").on("connection", (socket) => {
	socket.emit("connected", "connection successful");

	socket.on("create", () => {
		let code = tracker.getNewCode(socket);
		socket.emit("lobby", code);	
	});

	socket.on("join", (code) => {
		let opponent = tracker.findLobby(code);
		
		// invalid code given
		if(!opponent) {
			socket.emit("error", "lobby code not found");
		} else {
			// put this socket in a room with the lobby creator's socket
			makeRoom(socket, opponent, code);
		}
	});
});

function makeRoom(sock1: Socket, sock2: Socket, code: string) {
	sock1.join(code);
	sock2.join(code);
	io.of('/race/private').in(code).emit("race", "room created");

	// remove open lobby from tracker
	tracker.removeLobby(code);
}
