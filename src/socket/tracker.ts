import { Socket } from 'socket.io';
import { Race } from './race';
import Problem from '../lib/problem';

export class Tracker {
	// map lobby codes to the socket of waiting player
	openLobbies = new Map();
	activeRaces = new Map();
	rooms = new Set();

	// stores room key of players searching for opponent
	searching = new Map();

	search(difficulty: string) {
		if(this.searching.has(difficulty)) {
			let code = this.searching.get(difficulty);
			this.searching.delete(difficulty);
			return [code, true];
		} else {
			let newCode = this.generateRandCode();
			if(this.rooms.has(newCode)) {
				this.search(difficulty);
			}
			this.searching.set(difficulty, newCode);
			this.openLobbies.set(newCode, difficulty);
			this.rooms.add(newCode);
			return [newCode, false];
		}
	}

	// start a race
	async start(code: string): Promise<Problem|null> {
		if(!this.openLobbies.has(code)) {
			console.log("invalid code");
			return null;
		}

		// create a new race, pass in room code and difficulty
		let race: Race = new Race(code, this.openLobbies.get(code));
		await race.setProblem(this.openLobbies.get(code));

		// associates the code with the race
		this.activeRaces.set(code, race);
		
		this.removeLobby(code);
		return race.problem;
	}

	// returns a new lobby code and adds lobby to openLobbies
	createLobby(difficulty: string): string {
		let newCode = this.generateRandCode();

		// make sure code is unique globally
		if(this.rooms.has(newCode)) {
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

	findRace(code: string): Race {
		return this.activeRaces.get(code);
	}

	removeRace(code: string): void {
		this.activeRaces.delete(code);
		this.rooms.delete(code);
	}

	getRaceProblem(code: string): Problem|null {
		const race = this.activeRaces.get(code);
		return race.problem;
	}

	cancelSearch(code: string): void {
		for(const [key, value] of this.searching.entries()) {
			if(code == value) {
				this.searching.delete(key);
			}
		}
	
		this.openLobbies.delete(code);
	}
}
