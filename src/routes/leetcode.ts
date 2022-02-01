import Leetcode from "../lib/leetcode";
import Problem from '../lib/problem';
import { Credit, EndPoint, Uris } from '../utils/interfaces';
import Dotenv from 'dotenv';

const credit = {
    session: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzcwMTA5MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMmY5ZDIyNWUwYWMyYWU2OGJkMzYwZGU2NDllNmI4NzczN2FjMGJkNiIsImlkIjozNzAxMDkzLCJlbWFpbCI6Imxhd3JlbmNlZnVAdWNsYS5lZHUiLCJ1c2VybmFtZSI6ImxmdTciLCJ1c2VyX3NsdWciOiJsZnU3IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2xmdTcvYXZhdGFyXzE2MzE4MzUxMDIucG5nIiwicmVmcmVzaGVkX2F0IjoxNjQzNTE3OTU1LCJpcCI6IjI2MDM6ODAwMTo2OTAxOjI1ODc6ZTE1NzoxM2YyOjZkNTM6MTM2YyIsImlkZW50aXR5IjoiMmFhMmIwN2IwMzI2Y2RjM2UxYmI3NmI2OTk0OWQwMWIiLCJzZXNzaW9uX2lkIjoxNzM5NDgwNCwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.Z3hFFNyfDrRPocTlpr6E_N-ur2ZRWvAo_kjw-fAXtNI",
    csrfToken: "jJIGk1letDHEKmy6JyJjIWZTjJ0ejcYo5Md0y7D0gYCB7601sfpcHBPpqeEklBYc",
};

const EASY = 0;
const MEDIUM = 1;
const HARD = 2;

const router = require('express').Router();


// sends problem details back to the client
async function sendProblemDetails(res, problem) {

    // call Leetcode API to acquire problem details
    await problem.detail();

    // parse the fields that should be sent back
    // return json to client
    res.json({
        slug: problem.slug,
        title: problem.title,
        content: problem.content,
        testcase: problem.sampleTestCase,
        codeSnippets: problem.codeSnippets
    })
}

// get a random question
router.get('/', async function(req, res) {
    Dotenv.config();

    const problems = await require('../Problems');

    //const problems: Array<Problem> = await leetcode.getAllProblems();
    const problem: Problem = problems[Math.floor(Math.random() * problems.length)];
    
    sendProblemDetails(res, problem);
})

router.get('/:difficulty', async function(req, res) {
    let code = -1;
    switch (req.params.difficulty) {
        case "easy":
            code = EASY;
            break;
        case 'medium':
            code = MEDIUM;
            break;
        case 'hard':
            code = HARD;
            break;
        default:
            res.status(400).json({
                msg: "Please select a valid difficulty: easy, medium, hard"
            })   
            return;
    }

    const problems = await require('../Problems');

    // filter the problems based on difficulty and whether the problem is free to access
    const filteredProblems: Array<Problem> = problems.filter((p: Problem) => {
        return (p.status === 0 && !p.locked);
    });

    const filteredProblem: Problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    sendProblemDetails(res, filteredProblem);
}) 

module.exports = router;
