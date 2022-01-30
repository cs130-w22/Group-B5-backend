const Schema = require("mongoose").Schema;

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
