import Leetcode from "../lib/leetcode";
import Problem from '../lib/problem';
import { Credit, EndPoint, Uris } from '../utils/interfaces';
import Dotenv from 'dotenv';

const credit = {
    session: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzcwMTA5MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMmY5ZDIyNWUwYWMyYWU2OGJkMzYwZGU2NDllNmI4NzczN2FjMGJkNiIsImlkIjozNzAxMDkzLCJlbWFpbCI6Imxhd3JlbmNlZnVAdWNsYS5lZHUiLCJ1c2VybmFtZSI6ImxmdTciLCJ1c2VyX3NsdWciOiJsZnU3IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2xmdTcvYXZhdGFyXzE2MzE4MzUxMDIucG5nIiwicmVmcmVzaGVkX2F0IjoxNjQzNTE3OTU1LCJpcCI6IjI2MDM6ODAwMTo2OTAxOjI1ODc6ZTE1NzoxM2YyOjZkNTM6MTM2YyIsImlkZW50aXR5IjoiMmFhMmIwN2IwMzI2Y2RjM2UxYmI3NmI2OTk0OWQwMWIiLCJzZXNzaW9uX2lkIjoxNzM5NDgwNCwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.Z3hFFNyfDrRPocTlpr6E_N-ur2ZRWvAo_kjw-fAXtNI",
    csrfToken: "jJIGk1letDHEKmy6JyJjIWZTjJ0ejcYo5Md0y7D0gYCB7601sfpcHBPpqeEklBYc",
};

const router = require('express').Router();

// get a random question
router.get('/', async function(req, res) {
    Dotenv.config();

    let leetcode = await Leetcode.build(
        process.env.LEETCODE_USERNAME || "",
        process.env.LEETCODE_PASSWORD || "",
        EndPoint.US,
    );

    const problems: Array<Problem> = await leetcode.getAllProblems();
    const problem: Problem = problems[Math.floor(Math.random() * problems.length)];
    
    await problem.detail();

    const slug = problem.slug;
    const title = problem.title;
    const content = problem.content;
    const testcase = problem.sampleTestCase;
    const codeSnippets = problem.codeSnippets;

    res.json({
        slug: slug,
        title: title,
        content: content,
        testcase: testcase,
        codeSnippets: codeSnippets
    })

})

module.exports = router;
