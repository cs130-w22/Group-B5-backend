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

/**
 * Attempts to insert a new username/password combination into the User database.
 * Returns true on success, false on error.
 */
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

/**
 * Takes a username and password, and tries to match these with an entry in the User
 * database. If a match is found, returns true, otherwise returns false.
 */
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

/**
 * Gets the stats of a given user. Returns 3 sets of data. The first being
 * the total number of wins for the user, the second being the total number of races
 * the user has participated in, and the third being an array of data corresponding
 * to each race the user has participated in.
 */
async function getStats(name: string) {
	try {
		const user = await models.User.findOne({ name: name });
		if(!user) throw new Error(`User could not be found with username: ${name}`);

		const allRaces = await models.UserHistory.find({ name: name });
		const numRaces = allRaces.length;

		const wins = await models.UserHistory.find({ name: name, won: true });
		const numWins = wins.length;
		
		// get info for each race
		let raceData: object[] = [];
		for(let i=0; i<numRaces; i++) {
			const id = allRaces[i].race;
			const r = await models.Race.findById(id);
			raceData.push(r);
		}
		return [numWins, numRaces, raceData];
	}
	catch(error) {
		return null;
	}
}

/**
* Returns data stored in the Race database corresponding to a race with the given race ID
*/
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
/**
* Updates the Race database by adding a new entry with the following data
* from the Race object and list of players: Title, date, difficulty, number of participants,
* time to solve, and winner.
*/
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

	players.forEach(async function(player) {
		let user: string = player.decoded["user"];
		let won: boolean = (user === winner);

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
