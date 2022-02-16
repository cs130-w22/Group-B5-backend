import Leetcode from "./leetcode";
import Problem from './problem';
import { EndPoint, ProblemDifficulty, Credit} from '../utils/interfaces';


class LeetcodeProblems {

    static leetcode: Leetcode;
    static problems: Array<Problem>;

    static setLeetcode(leetcode: Leetcode): void {
        LeetcodeProblems.leetcode = leetcode;
    }

    static async setProblems() {
        LeetcodeProblems.problems = await LeetcodeProblems.leetcode.getAllProblems();
    }

    static async getAnyProblem(): Promise<Problem|null> {

        if (LeetcodeProblems.problems.length === 0) {
            return null;
        }

        const problem = LeetcodeProblems.problems[Math.floor(Math.random() * LeetcodeProblems.problems.length)];
        await problem.detail();
        return problem;
    }

    static async getProblemByDifficulty(difficulty: number): Promise<Problem|null> {
        
        if (LeetcodeProblems.problems.length === 0) {
            return null;
        }

        if (difficulty !== ProblemDifficulty["Easy"] && difficulty !== ProblemDifficulty["Medium"] && difficulty !== ProblemDifficulty["Hard"] ) {
            return null;
        }
        
        const filteredProblems: Array<Problem> = LeetcodeProblems.problems.filter((p: Problem) => {
            return (p.difficulty === difficulty && !p.locked);
        });

        const problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
        await problem.detail();
        return problem;
    }
}

export default LeetcodeProblems;