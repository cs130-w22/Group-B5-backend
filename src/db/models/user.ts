const Schema = require("mongoose").Schema;

const User = new Schema({
	name: String,
	password: String
});

module.exports = User;
