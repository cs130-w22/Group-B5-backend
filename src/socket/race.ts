import { Socket } from 'socket.io';
import Problem from '../lib/problem';
import LeetcodeProblems from '../lib/LeetcodeProblems';
import { ProblemDifficulty } from '../utils/interfaces';

export class Race {
	roomKey: string;
	problem: Problem|null;

	constructor(roomKey: string, difficulty: number) {
		this.roomKey = roomKey;
		console.log("Race object " + roomKey + " created with difficulty: " + difficulty);
		// TODO: fetch problem based on difficulty
		// and set this.problem to point to it
		this.problem = null;
	}

	async setProblem(difficulty: number) {
		if (difficulty === 0) {
			this.problem = await LeetcodeProblems.getAnyProblem()
		}
		else if (difficulty === ProblemDifficulty["Easy"] || difficulty === ProblemDifficulty["Medium"] || difficulty == ProblemDifficulty["Hard"]) {
			this.problem = await LeetcodeProblems.getProblemByDifficulty(difficulty)
		}
		else {
			this.problem = null;
		}
	}
}
