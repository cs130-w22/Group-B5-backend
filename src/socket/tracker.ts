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

	/**
	 * Tries to find a match for a user making a random matchmaking request.
	 * Returns an array with the first value of the array being a socket.io
	 * room key generated by Tracker. The second value of the array is a boolean
	 * value that is True if a match is immediately found, and False if a match is not
	 * immediately found.
	 */
	async search(difficulty: string) {
		if(this.searching.has(difficulty)) {
			let code = this.searching.get(difficulty);
			this.searching.delete(difficulty);

			let race: Race = new Race(code, difficulty);
			await race.setProblem(difficulty);
			this.activeRaces.set(code, race);

			return [code, true];
		} else {
			let newCode = this.generateRandCode();
			if(this.rooms.has(newCode)) {
				return this.search(difficulty);
			}
			this.searching.set(difficulty, newCode);
			this.openLobbies.set(newCode, difficulty);
			this.rooms.add(newCode);
			return [newCode, false];
		}
	}

	/**
	 * Starts a tracked private lobby. Returns a promise
	 * of a Problem fetched from the Leetcode API.
	 */
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

	/**
	 * Creates a new private lobby. Returns a string representing
	 * a new lobby code.
	 */
	createLobby(difficulty: string): string {
		let newCode = this.generateRandCode();

		// make sure code is unique globally
		if(this.rooms.has(newCode)) {
			return this.createLobby(difficulty);
		}

		this.openLobbies.set(newCode, difficulty);
		return newCode;
	}

	/**
	 * Helper function that generates a globally unique
	 * 6-character string that can be used as a socket.io room key
	 */
	generateRandCode(): string {
		let out: string = '';
		let options: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		for(let i=0; i<6; i++) {
			out += options.charAt(Math.floor(Math.random() * options.length));
		}

		return out;
	}

	/**
	* Returns socket representing the user who first
	* created a lobby (returns null if lobby does not exist).
	*/
	findLobby(code: string): Socket | null {
		return this.openLobbies.get(code);
	}

	/**
	* Removes a lobby from the Tracker's list
	* of tracked lobbies.
	*/
	removeLobby(code: string): void {
		this.openLobbies.delete(code);
	}

	/**
	* Returns the Race object corresponding to the given
	* socket.io room key.
	*/
	findRace(code: string): Race {
		return this.activeRaces.get(code);
	}

	/**
	* Removes a race from the Tracker's set of active races.
	* Called when a race has concluded.
	*/
	removeRace(code: string): void {
		this.activeRaces.delete(code);
		this.rooms.delete(code);
	}

	/**
	* Returns a race's problem given its 
	* socket.io room key
	*/
	getRaceProblem(code: string): Problem|null {
		const race = this.activeRaces.get(code);
		return race ? race.problem : null;
	}

	/**
	* Cancels a user's random matchmaking search.
	* The Tracker object will delete its information about the
	* searching user.
	*/
	cancelSearch(code: string): void {
		for(const [key, value] of this.searching.entries()) {
			if(code == value) {
				this.searching.delete(key);
			}
		}
	
		this.openLobbies.delete(code);
	}
}
