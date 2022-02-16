import Leetcode from "./leetcode";
import Problem from './problem';
import { EndPoint, ProblemDifficulty, Credit} from '../utils/interfaces';


class LeetcodeProblems {

    leetcode?: Leetcode;
    problems?: Array<Problem>;


    constructor() {

    }

    setLeetcode(leetcode: Leetcode) {
        this.leetcode = leetcode;
    }

    async getAnyProblem() {

        if (this.leetcode === undefined) {
            return null;
        }

        if (this.problems === undefined) {
            this.problems = await this.leetcode.getAllProblems();
        }
        const problem = this.problems[Math.floor(Math.random() * this.problems.length)];
        await problem.detail();
        return problem;

    }

    async getProblemByDifficulty(difficulty: number): Promise<Problem|null> {
        
        if (this.leetcode === undefined) {
            return null;
        }

        if (difficulty !== ProblemDifficulty["Easy"] && difficulty !== ProblemDifficulty["Medium"] && difficulty !== ProblemDifficulty["Hard"] ) {
            return null;
        }
        
        if (this.problems === undefined) {
            this.problems = await this.leetcode.getAllProblems();
        }
        const filteredProblems: Array<Problem> = this.problems.filter((p: Problem) => {
            return (p.difficulty === difficulty && !p.locked);
        });

        const problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
        await problem.detail();
        return problem;
    }
}

const leetcodeProblems: LeetcodeProblems = new LeetcodeProblems();

export default leetcodeProblems;