import Leetcode from "./leetcode";
import Problem from './problem';
import { EndPoint, ProblemDifficulty, Credit} from '../utils/interfaces';

// Class that holds all the Leetcode Problems that will be sent to users
// Problems should only be fetched once via the Leetcode API when the server is initialized
// Provides static functions that allow Leetcode Problems to be fetched based on their difficulty
class LeetcodeProblems {

    static leetcode: Leetcode;
    static problems: Array<Problem>;

    static setLeetcode(leetcode: Leetcode): void {
        LeetcodeProblems.leetcode = leetcode;
    }

    // function to get all the Leetcode problems
    static async setProblems() {
        LeetcodeProblems.problems = await LeetcodeProblems.leetcode.getAllProblems();
    }

    // function to get one Leetcode problem
    static async getAnyProblem(): Promise<Problem|null> {

        // Leetcode problems must be fetched first
        if (LeetcodeProblems.problems === undefined) {
            await LeetcodeProblems.setProblems();
        }

        if (LeetcodeProblems.problems.length === 0) {
            return null;
        }

        // filters the problems based on whether the Problem is free to play
        const filteredProblems: Array<Problem> = LeetcodeProblems.problems.filter((p: Problem) => {
            return (!p.locked);
        });

        // selects a random problem
        const problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];

        // waits for the problem details to be fetched from the Leetcode
        await problem.detail();
        return problem;
    }

    // function to get one Leetcode problem of a given difficulty
    static async getProblemByDifficulty(difficulty: number): Promise<Problem|null> {
        
        // Leetcode problems must be fetched first
        if (LeetcodeProblems.problems === undefined) {
            await LeetcodeProblems.setProblems();
        }

        if (LeetcodeProblems.problems.length === 0) {
            return null;
        }

        // difficulty must be valid
        if (difficulty !== ProblemDifficulty["Easy"] && difficulty !== ProblemDifficulty["Medium"] && difficulty !== ProblemDifficulty["Hard"] ) {
            return null;
        }
        
        // filters the problems based on whether the Problem is free to play and difficulty
        const filteredProblems: Array<Problem> = LeetcodeProblems.problems.filter((p: Problem) => {
            return (p.difficulty === difficulty && !p.locked);
        });

        // selects a random problem
        const problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];

         // waits for the problem details to be fetched from the Leetcode
        await problem.detail();
        return problem;
    }
}

export default LeetcodeProblems;