import { Schema } from 'mongoose';

const User = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true	
	}
});

module.exports = User;
