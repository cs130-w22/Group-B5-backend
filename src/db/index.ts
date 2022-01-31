const mongoose = require('mongoose');
const models = require('./models/index');
const bcrypt = require('bcryptjs')

// connect to mongoDB database
mongoose.connect('mongodb+srv://LeetRacer:theEleetracer101@cluster0.7wm2w.mongodb.net/default?retryWrites=true&w=majority')
.catch((e) => { console.log("Failed to connect to the db: \n", e); process.exit(); })

const db = mongoose.connection;

db.on('error', (err) => {
	console.log('Connection error:', err);
});

db.once('open', () => {
	console.log('Connected to database!');
});

// insert a new username/password combination into the database
// return true on success, false on failure (if username already exists)
async function addNewUser(name, password) {
	try {
		const hash = await bcrypt.hash(password, 8);
		const newUser = new models.User({ name: name, password: hash });
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
		let user = await models.User.findOne({ name: name });
		if(!user) throw new Error(`User could not be found with username: ${name}`);

		let check = await bcrypt.compare(password, user.password);
		if(!check) throw new Error(`Incorrect password for username ${name}`)

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
