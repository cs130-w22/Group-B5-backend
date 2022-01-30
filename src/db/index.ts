const mongoose = require('mongoose');
const models = require('./models/index');

// connect to mongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/leetracerDB');

// insert a new username/password combination into the database
// return true on success, false on failure (if username already exists)
async function addNewUser(name, password) {
	const newUser = new models.User({ name: name, password: password });
	try {
		await newUser.save();
	}
	catch (error) {
		return false;
	}
	return true;
}

// returns true if name/password exist as a user in the database, false otherwise
async function checkPassword(name, password) {
	try {
		await models.User.findOne({ name: name, password: password }).orFail();
	}
	catch (error) {
		return false;
	}
	return true;
}

module.exports = {
	addNewUser,
	checkPassword
};

// TypeScript specific export statement
export { addNewUser, checkPassword };
