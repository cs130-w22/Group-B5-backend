import Leetcode from "../src/lib/leetcode";
import Problem from '../src/lib/problem';
import { Credit, EndPoint, SubmissionStatus } from '../src/utils/interfaces';
import Submission from "../src/lib/submission";

import { expect } from 'chai';
import 'mocha';

const path = require('path');
const fs = require('fs')


describe("# Leetcode Submission Tests", () => {

    const session: string = process.env.LEETCODE_SESSION || "error";
    const csrfToken: string = process.env.LEETCODE_CSRF || "error";
    const credit = {
        session: session,
        csrfToken: csrfToken
    };
    const endpoint = EndPoint["US"];

    describe("# Testing Accepted Solution", () => {
        // accepted test case
        let submission: Submission;
        before(async () => {
            fs.readFile(path.join(__dirname, "/test_cases/accepted.py"), async (err: any, data: any) => {
                if (err) throw err;
                const s = data.toString()
                submission = await submit(credit, endpoint, "two-sum", "python3", s);
            });
        
        })

        it('Submission Object must be instance of Submission', async function () {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Accepted', function () {
            expect(submission.status).to.equal(SubmissionStatus["Accepted"]);
        });
    });

    describe("# Testing Compile Error Solution", () => {
        // accepted test case
        let submission: Submission;
        before(async () => {
            fs.readFile(path.join(__dirname, "/test_cases/compile_error.cpp"), async (err: any, data: any) => {
                if (err) throw err;
                const s = data.toString()
                const submission: Submission = await submit(credit, endpoint, "two-sum", "cpp", s);
            })
        
        })

        it('Submission Object must be instance of Submission', async function () {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Compile Error', function () {
            expect(submission.status).to.equal(SubmissionStatus["Compile Error"]);
        });
    });

    describe("# Testing Incorrect Solution", () => {
        // accepted test case
        let submission: Submission;
        before(async () => {
            fs.readFile(path.join(__dirname, "/test_cases/incorrect.py"), async (err: any, data: any) => {
                if (err) throw err;
                const s = data.toString()
                const submission: Submission = await submit(credit, endpoint, "add-two-numbers", "python3", s);
            })
        
        })

        it('Submission Object must be instance of Submission', async function () {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Incorrect', function () {
            expect(submission.status).to.equal(SubmissionStatus["Wrong Answer"]);
        });
    });

    describe("# Testing Runtime Error Solution", () => {
        // accepted test case
        let submission: Submission;
        before(async () => {
            fs.readFile(path.join(__dirname, "/test_cases/runtime_error.py"), async (err: any, data: any) => {
                if (err) throw err;
                const s = data.toString()
                const submission: Submission = await submit(credit, endpoint, "median-of-two-sorted-arrays", "python3", s);
            })
        
        })

        it('Submission Object must be instance of Submission', async function () {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Runtime Error', function () {
            expect(submission.status).to.equal(SubmissionStatus["Runtime Error"]);
        });
    });

    describe("# Testing Time Limit Exceeded Solution", () => {
        // accepted test case
        let submission: Submission;
        before(async () => {
            fs.readFile(path.join(__dirname, "/test_cases/tle.py"), async (err: any, data: any) => {
                if (err) throw err;
                const s = data.toString()
                const submission: Submission = await submit(credit, endpoint, "find-substring-with-given-hash-value", "python3", s);
        
                console.log(submission.status);
                console.log(submission.input);
                console.log(submission.expected_output);
            })
        })

        it('Submission Object must be instance of Submission', async function () {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Time Limit Exceeded', function () {
            expect(submission.status).to.equal(SubmissionStatus["Time Limit Exceeded"]);
        });
    });

    

});




async function submit(credit: Credit, endpoint: EndPoint, slug: string, lang: string, code: string): Promise<Submission> {

    // configures global Helper module to take submit under a new user
    let leetcode: Leetcode;

    // created a new build method for leetcode object, since old one does not work correctly
    leetcode = await Leetcode.build2(credit, endpoint);

    // creates a new problem based on the slug
    const problem: Problem = new Problem(slug);
    await problem.detail();
    
    const submission: Submission = await problem.submit(lang, code);
    
    // leetcode may take a while to actually compute the results of a submission
    // periodically checks leetcode to see if submission results are ready
    for (let i = 0; i < 10; i++) {

        // timeout two seconds
        await new Promise(r => setTimeout(r, 2000));
        await submission.detail()

        // if the submission is ready, break the loop
        if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
            break;
        }
    }

    return submission;

}