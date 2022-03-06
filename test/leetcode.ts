import { expect } from 'chai';
import Dotenv from 'dotenv';
import 'mocha';

import Leetcode from '../src/lib/leetcode';
import Problem from '../src/lib/problem';
import Submission from '../src/lib/submission';
import { EndPoint, ProblemDifficulty, SubmissionStatus} from '../src/utils/interfaces';

const fs = require('fs');
const path = require('path');

describe("# Leetcode API Tests", () => {
    let leetcode: Leetcode;
    before(async () => {
        const session: string = process.env.LEETCODE_SESSION || "error";
        const csrfToken: string = process.env.LEETCODE_CSRF || "error";
        const credit = {
	        session: session,
	        csrfToken: csrfToken
        };
        const endpoint = EndPoint["US"];
        leetcode = Leetcode.build2(credit, endpoint);
    });

    describe("Testing Leetcode API Instantiation", async function () {
        it("Instantiated Leetcode Object should be instance of Leetcode", () => {
            expect(leetcode).to.instanceOf(Leetcode);
        });
        it("Instantitaed Leetcode Object should have active session", () => {
            expect(leetcode.session).to.not.null;
        });
    });

    // Test cases to get Leetcode Questions
    describe("Testing Leetcode API ability to retreive questions", async function () {

        let problems: Array<Problem>;
        let problem: Problem;
        it('Instantiated Leetcode Object must be able to get all Leetcode Questions', async function () {
            problems = await leetcode.getAllProblems();
            expect(problems.length).least(1000);
        });

        it('Retrieved Questions must not be null', function () {
            problem = problems[Math.floor(Math.random() * problems.length)];
            expect(problem.slug).to.not.null;
        });

        it('Retrieved Questions must have a difficulty', function() {
            expect(problem.difficulty).to.be.oneOf([
                ProblemDifficulty["Easy"],
                ProblemDifficulty["Medium"],
                ProblemDifficulty["Hard"],
            ]);
        })

    });

});