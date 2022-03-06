import { Schema } from 'mongoose';

const Race = new Schema({
	title: {
		type: String,
	},
	date: {
		type: Date,
	},
	difficulty: {
		type: String,
	},
	numParticipants: {
		type: Number,
	},
	// timeToSolve: stored as seconds
	timeToSolve: {
		type: Number,
	},
	winner: {
		type: String
	}
});

module.exports = Race;
export { Race };
