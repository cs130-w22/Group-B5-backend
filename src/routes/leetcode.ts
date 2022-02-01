import Problem from '../lib/problem';

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

// get a free question from leetcode, unfiltered for difficulty
router.get('/', async function(req, res) {

    const problems = await require('../Problems');

    // filter the problems based on whether the problem is free to access
    const filteredProblems: Array<Problem> = problems.filter((p: Problem) => {
        return !p.locked;
    });

    // select random problem
    const filteredProblem: Problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    sendProblemDetails(res, filteredProblem);
})

// get a free question from leetcode, filtered for difficulty
router.get('/:difficulty', async function(req, res) {
    let code = -1;

    // map the received input with appropriate difficulty code
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

        // send error message if invalid input
            res.status(400).json({
                msg: "Please select a valid difficulty: easy, medium, hard"
            })   
            return;
    }

    const problems = await require('../Problems');

    // filter the problems based on difficulty and whether the problem is free to access
    const filteredProblems: Array<Problem> = problems.filter((p: Problem) => {
        return (p.difficulty === code && !p.locked);
    });

    // select random problem
    const filteredProblem: Problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    sendProblemDetails(res, filteredProblem);
}) 

module.exports = router;
