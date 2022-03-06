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
        const credit = {
            session: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzcwMTA5MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMmY5ZDIyNWUwYWMyYWU2OGJkMzYwZGU2NDllNmI4NzczN2FjMGJkNiIsImlkIjozNzAxMDkzLCJlbWFpbCI6Imxhd3JlbmNlZnVAdWNsYS5lZHUiLCJ1c2VybmFtZSI6ImxmdTciLCJ1c2VyX3NsdWciOiJsZnU3IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2xmdTcvYXZhdGFyXzE2MzE4MzUxMDIucG5nIiwicmVmcmVzaGVkX2F0IjoxNjQ2NDY0Mjc0LCJpcCI6IjI2MDM6ODAwMTo2OTAxOjI1ODc6ZTE4NTozNjI0OmE4Y2Y6MzJjMCIsImlkZW50aXR5IjoiNDZjYTYxNDQ1MjY2NzYzMTQzNDgxODUyNjg4MmYxMDAiLCJzZXNzaW9uX2lkIjoxODY1NDg0NywiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.VkECypOZHGz4-yBdtFDU9V6rKoMzB0oB8vAlTqB_HVQ",
            csrfToken: "cL6RT3ctYA2pxF1t9ECNcWVkEQyoQUNVbKihLai2DnIIjgKlmNJIiDbKk6KMgU5p",
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
