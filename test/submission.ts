import { expect } from 'chai';
import Dotenv from 'dotenv';
import 'mocha';
import Leetcode from '../src/lib/leetcode';
import Problem from '../src/lib/problem';
import Submission from '../src/lib/submission';
import { EndPoint, ProblemStatus, SubmissionStatus } from '../src/utils/interfaces';

const path = require('path');
const fs = require('fs')

describe("# Submission", async function () {
    this.enableTimeouts(false);
    before(async () => {
        Dotenv.config();
        const session: string = process.env.LEETCODE_SESSION || "error";
        const csrfToken: string = process.env.LEETCODE_CSRF || "error";
        const credit = {
	        session: session,
	        csrfToken: csrfToken
        };
        const endpoint = EndPoint["US"];
        const leetcode: Leetcode = await Leetcode.build2(
            credit,
            endpoint
        );
    })

    describe("Testing Accepted Submission", async function () {
        let submission: Submission;
        let s: string;
        before(async () => {

            fs.readFile(path.join(__dirname, "/test_cases/accepted.py"), async (err: any, data: any) => {
                if (err) throw err;
                s = data.toString()
            });

            const problem: Problem = new Problem("two-sum");
            await problem.detail();

            await new Promise(r => setTimeout(r, 10000));

            submission = await problem.submit("python3", s);

            for (let i = 0; i < 10; i++) {

                // timeout two seconds
                await new Promise(r => setTimeout(r, 2000));
                await submission.detail()

                // if the submission is ready, break the loop
                if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
                    break;
                }
            }
        });

        it("Should be instance of Submission", () => {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Accepted', function () {
            expect(submission.status).to.equal(SubmissionStatus["Accepted"]);
        });
    });

    describe("Testing Compile Error Submission", async function () {
        let submission: Submission;
        let s: string;
        before(async () => {

            fs.readFile(path.join(__dirname, "/test_cases/compile_error.cpp"), async (err: any, data: any) => {
                if (err) throw err;
                s = data.toString()
            });

            const problem: Problem = new Problem("two-sum");
            await problem.detail();

            await new Promise(r => setTimeout(r, 10000));

            submission = await problem.submit("cpp", s);

            for (let i = 0; i < 10; i++) {

                // timeout two seconds
                await new Promise(r => setTimeout(r, 2000));
                await submission.detail()

                // if the submission is ready, break the loop
                if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
                    break;
                }
            }
        });

        it("Should be instance of Submission", () => {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Compile Error', function () {
            expect(submission.status).to.equal(SubmissionStatus["Compile Error"]);
        });
    });

    describe("Testing Wrong Answer Submission", async function () {
        let submission: Submission;
        let s: string;
        before(async () => {

            fs.readFile(path.join(__dirname,"/test_cases/incorrect.py"), async (err: any, data: any) => {
                if (err) throw err;
                s = data.toString()
            });

            const problem: Problem = new Problem("add-two-numbers");
            await problem.detail();

            await new Promise(r => setTimeout(r, 10000));

            submission = await problem.submit("python3", s);

            for (let i = 0; i < 10; i++) {

                // timeout two seconds
                await new Promise(r => setTimeout(r, 2000));
                await submission.detail()

                // if the submission is ready, break the loop
                if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
                    break;
                }
            }
        });

        it("Should be instance of Submission", () => {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Wrong Answer', function () {
            expect(submission.status).to.equal(SubmissionStatus["Wrong Answer"]);
        });
    });

    describe("Testing Runtime Error Submission", async function () {
        let submission: Submission;
        let s: string;
        before(async () => {

            fs.readFile(path.join(__dirname,"/test_cases/runtime_error.py"), async (err: any, data: any) => {
                if (err) throw err;
                s = data.toString()
            });

            const problem: Problem = new Problem("median-of-two-sorted-arrays");
            await problem.detail();

            await new Promise(r => setTimeout(r, 10000));

            submission = await problem.submit("python3", s);

            for (let i = 0; i < 10; i++) {

                // timeout two seconds
                await new Promise(r => setTimeout(r, 2000));
                await submission.detail()

                // if the submission is ready, break the loop
                if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
                    break;
                }
            }
        });

        it("Should be instance of Submission", () => {
            expect(submission).to.instanceOf(Submission);
        });

        it('Submission status should be Runtime Error', function () {
            expect(submission.status).to.equal(SubmissionStatus["Runtime Error"]);
        });
    });
});
