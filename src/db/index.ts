let mongoose = require('mongoose');
var models = require('./models/index');

// connect to mongoDB server
mongoose.connect('mongodb://127.0.0.1:27017/leetracerDB');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
