import Leetcode from "./lib/leetcode";
import Problem from './lib/problem';
import { EndPoint } from './utils/interfaces';
import Dotenv from 'dotenv';

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


//export default Leetcode;
