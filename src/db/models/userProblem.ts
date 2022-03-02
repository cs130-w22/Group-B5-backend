import { Schema } from 'mongoose';

const UserProblem = new Schema({
	name: {
		type: String,
		required: true,
        unique: true,
	},
	description: {
        type: String,
        required: true,
    },

    /*
    list of tuples:
    {
        input: xxx
        output: xxx
    }
    */
    testcases: {
        type: [{"input": Schema.Types.Mixed, "output": Schema.Types.Mixed}],
        required: true,
    }
});

module.exports = UserProblem;