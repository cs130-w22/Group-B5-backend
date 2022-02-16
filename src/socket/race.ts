import { Socket } from 'socket.io';
import Problem from '../lib/problem';
import leetcodeProblems from '../lib/LeetcodeProblems';

export class Race {
	roomKey: string;
	//problem: Problem|null;

	constructor(roomKey: string, difficulty: string) {
		this.roomKey = roomKey;
		console.log("Race object " + roomKey + " created with difficulty: " + difficulty);
		// TODO: fetch problem based on difficulty
		// and set this.problem to point to it

	}
}
