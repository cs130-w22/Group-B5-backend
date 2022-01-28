const models = require('./models/index');

// insert a new username/password combination into the database
function addNewUser(name, password) {
	const newUser = new models.User({ name: name, password: password });
	newUser.save();
}

// returns true if name/password exist as a user in the database, false otherwise
async function checkPassword(name, password) {
	let match = await models.User.findOne({ name: name, password: password });
	return match;
}

module.exports = {
	addNewUser,
	checkPassword
};
