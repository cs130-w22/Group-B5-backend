import e from "cors";
import Helper from "../utils/helper";
import { SubmissionStatus, Uris } from "../utils/interfaces";

// class copied from realVEct0r's leetcode-api

// this class was heavily modified from the original to include more information and for error handling
class Submission {
    static uris: Uris;

    static setUris(uris: Uris): void {
        Submission.uris = uris;
    }

    // constructor contains different fields describing the result of the submission
    // "id" is especially important, as each submission is uniquely identified by this value
    // the "id" value is used to query Leetcode for these specific submission results
    constructor(
        public id: number,
        public isPending?: string,
        public lang?: string,
        public memory?: string,
        public runtime?: string,
        public status?: SubmissionStatus,
        public timestamp?: number,
        public code?: string,
        public code_output? :string,
        public compile_error? :string,
        public runtime_error? :string,
        public total_correct? :string,
        public total_testcases? :string,
        public input? :string,
        public expected_output? :string,
    ) { }

    // important function that gets details for each submission. 
    async detail(): Promise<Submission> {
        const response = await Helper.HttpRequest({
            url: Submission.uris.submission.replace("$id", this.id.toString()),
        });

        // submission status might be undefined if Leetcode has not finished checking the submitted code against internal test cases
        try {
            this.status = Helper.submissionStatusMap(response.match(/parseInt\('(\d+)', 10/)[1]);
        } catch (error) {

            // sets the submission status to be "Submission Not Ready" to trigger timeout before querying results again
            this.status = SubmissionStatus["Submission Not Ready"];
            return this;
        }

        // these 3 fields will always be present in a submission
        this.lang = response.match(/getLangDisplay:\s'([^']*)'/)[1];
        this.memory = response.match(/memory:\s'([^']*)'/)[1];
        this.runtime = response.match(/runtime:\s'([^']*)'/)[1];
        
        // all other fields will only be present based on the result of the submission


        // only execute if status is "compile error"
        if (this.status === SubmissionStatus["Compile Error"]) {
            this.compile_error = response.match(/compile_error :\s'([^']*)'/)[1];
        }

        // execute if "runtime error"
        if (this.status == SubmissionStatus["Runtime Error"]) {
            this.runtime_error = response.match(/runtime_error :\s'([^']*)'/)[1];
        }
    
    
        // only execute if status is "wrong answer", "time limit exceeded", "output limit exceeded", "runtime error"

        if (this.status === SubmissionStatus["Wrong Answer"] || this.status === SubmissionStatus["Time Limit Exceeded"] || this.status === SubmissionStatus["Output Limit Exceeded"] || this.status === SubmissionStatus["Runtime Error"]) {
            this.total_correct = response.match(/total_correct : '(\d+)'/)[1];
            this.total_testcases = response.match(/total_testcases : '(\d+)'/)[1];
            this.input = JSON.parse(`"${response.match(/input :\s'([^']*)'/)[1]}"`);
            this.expected_output = JSON.parse(`"${response.match(/expected_output :\s'([^']*)'/)[1]}"`);
        }

        // execute if "compile error", "wrong answer", "runtime error"
        if (this.status === SubmissionStatus["Compile Error"] || this.status === SubmissionStatus["Wrong Answer"]) {
            this.code_output = response.match(/code_output :\s'([^']*)'/)[1];
        }

        return this;
    }
}

export default Submission;
