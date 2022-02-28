import { Schema } from 'mongoose';

const Race = new Schema({
	name: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	difficulty: {
		type: String,
		required: true
	},
	numParticipants: {
		type: Number,
		required: true
	},
	// timeToSolve: stored as seconds
	timeToSolve: {
		type: Number,
		required: true
	}
});

module.exports = Race;
