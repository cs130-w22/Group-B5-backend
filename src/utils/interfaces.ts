// class mostly copied from realVEct0r's leetcode-api

interface HttpRequestOptions {
    method?: string;
    url: string;
    referer?: string;
    resolveWithFullResponse?: boolean;
    form?: any;
    body?: any;
}

interface GraphQLRequestOptions {
    origin?: string;
    referer?: string;
    query: string;
    variables?: object;
}

interface Credit {
    session?: string;
    csrfToken: string;
}

enum ProblemStatus {
    "Accept",
    "Not Accept",
    "Not Start"
}

enum ProblemDifficulty {
    "Any",
    "Easy",
    "Medium",
    "Hard",
}

// modified to accommodate additional submission statuses
enum SubmissionStatus {
    "Accepted",
    "Compile Error",
    "Wrong Answer",
    "Time Limit Exceeded",
    "Memory Limit Exceeded",
    "Output Limit Exceeded",
    "Runtime Error",
    "Internal Error",
    "Unknown Error",
    "Server Timeout",
    "Submission Not Ready",
}

enum EndPoint {
    "US",
    "CN",
}

interface Uris {
    base: string;
    login: string;
    graphql: string;
    problemsAll: string;
    problem: string;
    submit: string;
    submission: string;
}

export { HttpRequestOptions, GraphQLRequestOptions, Credit, ProblemStatus, ProblemDifficulty, SubmissionStatus, EndPoint, Uris, };

