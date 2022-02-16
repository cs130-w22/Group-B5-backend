import Leetcode from "./lib/leetcode";
import Problem from './lib/problem';
import { EndPoint, SubmissionStatus } from './utils/interfaces';
import Submission from "./lib/submission"
import Dotenv from 'dotenv';

const path = require('path');
const fs = require('fs')

let solution = `class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> imap;
        
        for (int i = 0;; ++i) {
            auto it = imap.find(target - nums[i]);
            
            if (it != imap.end()) 
                return vector<int> {i, it->second};
                
            imap[nums[i]] = i;
        }
    }
        
    };`;

/*
(async () => {
    Dotenv.config();

    let leetcode = await Leetcode.build(
        process.env.LEETCODE_USERNAME || "",
        process.env.LEETCODE_PASSWORD || "",
        process.env.LEETCODE_ENDPOINT === "CN" ? EndPoint.CN : EndPoint.US,
    );

    const problem: Problem = new Problem("two-sum");
    await problem.detail();
    //console.log(problem)

    //problem.submit("cpp", solution);

    const submissions = await problem.getSubmissions();

    // Filter submission which lang = cpp
   
    console.log(await submissions[0].detail());

    //console.log(submissions)


})()
*/

async function submit(session: string, csrfToken: string, endpoint: EndPoint, slug: string, lang: string, code: string): Promise<Submission> {

    let leetcode: Leetcode;
    leetcode = await Leetcode.build2(session, csrfToken, endpoint);

    const problem: Problem = new Problem(slug);
    await problem.detail();
    
    const submission: Submission = await problem.submit(lang, code);
    
    for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 2000));
        await submission.detail()

        if (submission.status !== SubmissionStatus["Submission Not Ready"]) {
            break;
        }
    }

    return submission;

}

async function main() {
    const session = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzcwMTA5MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMmY5ZDIyNWUwYWMyYWU2OGJkMzYwZGU2NDllNmI4NzczN2FjMGJkNiIsImlkIjozNzAxMDkzLCJlbWFpbCI6Imxhd3JlbmNlZnVAdWNsYS5lZHUiLCJ1c2VybmFtZSI6ImxmdTciLCJ1c2VyX3NsdWciOiJsZnU3IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2xmdTcvYXZhdGFyXzE2MzE4MzUxMDIucG5nIiwicmVmcmVzaGVkX2F0IjoxNjQ0ODk3NjI3LCJpcCI6IjI2MDM6ODAwMTo2OTAxOjI1ODc6YTkwZjo3OWU1OmQxNjk6MzEwYyIsImlkZW50aXR5IjoiM2U0ODlhYWMwZTQxMWQyNDJlNTUxNmVlZWY2ZGE0ZjIiLCJzZXNzaW9uX2lkIjoxODAzNjMyOSwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.I09RiHfbivTEO5jD510bkVkSEUz3gnXXfHj_-r9_k8w";
    const csrfToken = "yHc8JsMPpa2aGkvYszthH5FNAGWtSm5evttyJZ7IbLyUN3FK7liRmfIhd1WjDGpS";
    const endpoint = EndPoint["US"];

    // accepted test case
    fs.readFile(path.join(__dirname, "/test_cases/accepted.py"), async (err: any, data: any) => {
        if (err) throw err;
        const s = data.toString()
        const submission: Submission = await submit(session, csrfToken, endpoint, "two-sum", "python3", s);

        console.log(submission.status);
    })

    await new Promise(r => setTimeout(r, 5000));

    // compile error test case
    fs.readFile(path.join(__dirname, "/test_cases/compile_error.cpp"), async (err: any, data: any) => {
        if (err) throw err;
        const s = data.toString()
        const submission: Submission = await submit(session, csrfToken, endpoint, "two-sum", "cpp", s);

        console.log(submission.status);
        console.log(submission.compile_error);
        console.log(submission.code_output);
    })

    await new Promise(r => setTimeout(r, 5000));

    // incorrect error test case
    fs.readFile(path.join(__dirname, "/test_cases/incorrect.py"), async (err: any, data: any) => {
        if (err) throw err;
        const s = data.toString()
        const submission: Submission = await submit(session, csrfToken, endpoint, "add-two-numbers", "python3", s);

        console.log(submission.status);
        console.log(submission.input);
        console.log(submission.expected_output);
        console.log(submission.code_output);
    })

    await new Promise(r => setTimeout(r, 5000));

    // runtime error test case
    fs.readFile(path.join(__dirname, "/test_cases/runtime_error.py"), async (err: any, data: any) => {
        if (err) throw err;
        const s = data.toString()
        const submission: Submission = await submit(session, csrfToken, endpoint, "median-of-two-sorted-arrays", "python3", s);

        console.log(submission.status);
        console.log(submission.input);
        console.log(submission.expected_output);
        console.log(submission.code_output);
    })

    await new Promise(r => setTimeout(r, 5000));

    // tle error test case
    fs.readFile(path.join(__dirname, "/test_cases/tle.py"), async (err: any, data: any) => {
        if (err) throw err;
        const s = data.toString()
        const submission: Submission = await submit(session, csrfToken, endpoint, "find-substring-with-given-hash-value", "python3", s);

        console.log(submission.status);
        console.log(submission.input);
        console.log(submission.expected_output);
    })
}

main()




//export default Leetcode;
