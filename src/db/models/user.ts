var Schema = require("mongoose").Schema;

var User = new Schema({
	name: String,
	password: String
});

module.exports = User;
