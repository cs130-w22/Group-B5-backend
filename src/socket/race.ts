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

	constructor(roomKey: string, difficulty: string) {
		this.roomKey = roomKey;
		this.problem = null;
		this.problemTitle = null;
		this.startTime = new Date();
		this.difficulty = difficulty;
		console.log("Race object " + roomKey + " created with difficulty: " + difficulty);
	}

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

	async end(winner: string, players) {
		this.winner = winner;
		this.endTime = new Date();
		recordRace(this, players);
	}
}
