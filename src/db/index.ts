var models = require('./models/index');

// insert a new username/password combination into the database
function addNewUser(name, password) {
	const newUser = new models.User({ name: name, password: password });
	newUser.save();
}

// returns password of a given user, false if user does not exist
function getPassword(name, callback) {
	models.User.findOne({ name: name }, (err, user) => {
		if(err) {
			callback(false);
		} else if(user) {
			callback(user['password']);
		} else {
			callback(false);
		}
	});
}

module.exports = {
	addNewUser,
	getPassword
};
