import { Schema } from 'mongoose';

const UserStats = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	wins: {
		type: Number,
		default: 0
	},
	races: {
		type: Number,
		default: 0
	}
});

module.exports = UserStats;
