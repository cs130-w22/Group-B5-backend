import { Socket } from 'socket.io';
import Problem from '../lib/problem';
import LeetcodeProblems from '../lib/LeetcodeProblems';
import { ProblemDifficulty } from '../utils/interfaces';

export class Race {
	roomKey: string;
	problem: Problem|null;

	constructor(roomKey: string, difficulty: string) {
		this.roomKey = roomKey;
		console.log("Race object " + roomKey + " created with difficulty: " + difficulty);
		// TODO: fetch problem based on difficulty
		// and set this.problem to point to it
		this.problem = null;
	}

	async setProblem(difficulty: string) {
		if (difficulty === "Any") {
			this.problem = await LeetcodeProblems.getAnyProblem()
		}
		else if (difficulty === "Easy" || difficulty === "Medium" || difficulty == "Hard") {
			this.problem = await LeetcodeProblems.getProblemByDifficulty(ProblemDifficulty[difficulty]);
		}
		else {
			this.problem = null;
		}
	}
}
