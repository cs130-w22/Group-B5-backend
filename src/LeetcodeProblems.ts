import Leetcode from "./lib/leetcode";
import Problem from './lib/problem';
import { EndPoint, ProblemDifficulty, Credit} from './utils/interfaces';


class LeetcodeProblems {

    problems?: Array<Problem>;

    constructor() {

    }

    async getAnyProblem(credit: Credit, endpoint: EndPoint) {

        if (this.problems === undefined) {
            let leetcode = Leetcode.build2(credit, endpoint);
            this.problems = await leetcode.getAllProblems();
        }
        const problem = this.problems[Math.floor(Math.random() * this.problems.length)];
        await problem.detail();
        return problem;

    }

    async getProblemByDifficulty(credit: Credit, endpoint: EndPoint, difficulty: number): Promise<Problem|null> {
        
        if (difficulty !== ProblemDifficulty["Easy"] && difficulty !== ProblemDifficulty["Medium"] && difficulty !== ProblemDifficulty["Hard"] ) {
            return null;
        }
        
        if (this.problems === undefined) {
            let leetcode = Leetcode.build2(credit, endpoint);
            this.problems = await leetcode.getAllProblems();
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