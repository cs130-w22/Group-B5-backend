import { Socket } from 'socket.io';
import { Race } from './race';

export class Tracker {
	// map lobby codes to the socket of waiting player
	openLobbies = new Map();

	activeRaces = new Set();

	// start a race
	start(code: string): boolean {
		if(!this.openLobbies.has(code)) {
			console.log("invalid code");
			return false;
		}

		// create a new race, pass in room code and difficulty
		let race: Race = new Race(code, this.openLobbies.get(code));
		this.activeRaces.add(race);
		this.removeLobby(code);
		return true;
	}

	// returns a new lobby code and adds lobby to openLobbies
	createLobby(difficulty: string): string {
		let newCode = this.generateRandCode();

		// make sure code is unique globally
		if(this.openLobbies.has(newCode)) {
			return this.createLobby(difficulty);
		}

		this.openLobbies.set(newCode, difficulty);
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
