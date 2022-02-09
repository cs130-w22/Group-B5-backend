import { Socket } from 'socket.io';

export class PrivateLobbyTracker {
	// map lobby codes to the socket of waiting player
	openLobbies = new Map();

	getNewCode(socket: Socket): string {
		let newCode = this.generateRandCode();

		// make sure code is unique globally
		if(this.openLobbies.has(newCode)) {
			return this.getNewCode(socket);
		}

		this.openLobbies.set(newCode, socket);
		return newCode;
	}

	generateRandCode(): string {
		let out: string = '';
		let options: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		for(let i=0; i<6; i++) {
			out += options.charAt(Math.floor(Math.random() * options.length));
		}

		return out;
	}

	findLobby(code: string): Socket | null {
		return this.openLobbies.get(code);
	}

	removeLobby(code: string): void {
		this.openLobbies.delete(code);
	}
}
