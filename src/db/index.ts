const mongoose = require('mongoose');
const models = require('./models/index');
const bcrypt = require('bcryptjs')
import { Race } from '../socket/race';
import { Socket } from 'socket.io';
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

// get user stats
async function getStats(name: string) {
	try {
		const user = await models.User.findOne({ name: name });
		if(!user) throw new Error(`User could not be found with username: ${name}`);

		const allRaces = await models.UserHistory.find({ name: name });
		const numRaces = allRaces.length;

		const wins = await models.UserHistory.find({ name: name, won: true });
		const numWins = wins.length;
		
		return [numWins, numRaces, allRaces];
	}
	catch(error) {
		return null;
	}
}

async function getRace(id) {
	try {
		const race = await models.Race.findById(id);
		if(!race) throw new Error(`Race could not be found with id: ${id}`);

		return race;
	}
	catch(error) {
		return null;
	}
}

// update race history when a race ends
async function recordRace(race: Race, players) {
	const title = race.problemTitle;
	const date = race.startTime;
	const difficulty = race.difficulty;
	const numParticipants = players.length;
	const timeToSolve = (race.endTime!.getTime() - race.startTime.getTime()) / 1000;
	const winner = race.winner;
	const newRace = new models.Race({
		title: title, 
		date: date, 
		difficulty: difficulty,
		numParticipants: numParticipants,
		timeToSolve: timeToSolve,
		winner: winner
	}); 

	const doc = await newRace.save();
	const id = doc._id;

	players.forEach (async function(player) {
		let user: string = player.decoded["user"];
		let won: boolean = (user == winner);

		const newUserHistory = new models.UserHistory({name: user, race: id, won: won});
		await newUserHistory.save();
	});
}

module.exports = {
	addNewUser,
	checkPassword,
	getRace,
	getStats,
	recordRace
};

// TypeScript specific export statement
export { addNewUser, checkPassword, getRace, getStats, recordRace };
