import { Socket } from 'socket.io';
import Problem from '../lib/problem';
import LeetcodeProblems from '../lib/LeetcodeProblems';
import { ProblemDifficulty } from '../utils/interfaces';
import { recordRace } from '../db';

export class Race {
	roomKey: string;
	problem: Problem|null;
	startTime: Date;
	endTime?: Date;
	difficulty: string;
	winner?: string;
	problemTitle;

	/**
	 * @param roomKey Socket.io room key that corresponds to the Race
	 * @param difficulty String that corresponds to the desired problem difficulty
	 * (Easy/Medium/Hard)
	 */
	constructor(roomKey: string, difficulty: string) {
		this.roomKey = roomKey;
		this.problem = null;
		this.problemTitle = null;
		this.startTime = new Date();
		this.difficulty = difficulty;
		console.log("Race object " + roomKey + " created with difficulty: " + difficulty);
	}

	/**
	 * Fetches a problem from the Leetcode API with the desired difficulty
	 * and sets the Race's problem attribute to be this problem
	 *
	 * @param difficulty Difficulty of problem to set this.problem to
	 */
	async setProblem(difficulty: string) {
		if (difficulty === "Any") {
			this.problem = await LeetcodeProblems.getAnyProblem()
			this.problemTitle = this.problem!.title;
		}
		else if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") {
			this.problem = await LeetcodeProblems.getProblemByDifficulty(ProblemDifficulty[difficulty]);
			this.problemTitle = this.problem!.title;
		}
		else {
			this.problem = null;
			this.problemTitle = null;
		}
	}

	/**
	 * Sets winner and endTime attributes of race, and makes a subcall
	 * to recordRace in order to store race data in the database
	 *
	 * @param winner Username of winner of the race
	 * @param players Set of sockets corresponding to the race's players
	 */
	async end(winner: string, players) {
		this.winner = winner;
		this.endTime = new Date();
		recordRace(this, players);
	}
}
