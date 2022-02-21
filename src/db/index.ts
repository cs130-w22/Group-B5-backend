const mongoose = require('mongoose');
const models = require('./models/index');
const bcrypt = require('bcryptjs')
require("dotenv").config();

// connect to mongoDB database
mongoose.connect(process.env.MONGODB_URI)
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
		const newUserStats = new models.UserStats({ name: name });
		await newUserStats.save();
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

// updates win-rate stats of a user based on whether or not they won
async function updateStats(name: string, won: boolean) {
	try {
		let doc = await models.UserStats.findOne({ name: name });
		if(!doc) throw new Error(`User could not be found with username: ${name}`);

		doc.races = doc.races + 1;
		if(won) {
			doc.wins = doc.wins + 1;
		}
		await doc.save();
	}
	catch (error) {
		return false;
	}
	return true;
}

// get user stats
async function getStats(name: string) {
	try {
		let doc = await models.UserStats.findOne({ name: name });
		if(!doc) throw new Error(`User could not be found with username: ${name}`);
		
		return [doc.wins, doc.races];
	}
	catch(error) {
		return null;
	}
}

module.exports = {
	addNewUser,
	checkPassword,
	updateStats,
	getStats
};

// TypeScript specific export statement
export { addNewUser, checkPassword, updateStats, getStats };
