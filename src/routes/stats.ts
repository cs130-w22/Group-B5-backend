const router = require('express').Router();
import * as db from '../db';
import * as mongoose from 'mongoose';

router.get('/user/:user', async function(req, res, next) {
	const user = req.params.user

	// check for missing fields
	if(!user || user.length === 0) {
		return res.status(401).json({ err: true, message: "The username parameter is missing or incorrect" });
	}

	// check if credentials match user info in db
	const stats = await db.getStats(user);
	if(!stats) {
		return res.status(401).json({ err: true, message: "No user found with given login info" });
	}

	const wins = stats[0];
	const numRaces = stats[1];
	const races = stats[2];
	return res.status(200).json({ numWins: wins, numRaces: numRaces, races: races });
});

router.get('/race/:id', async function(req, res, next) {
	const id = req.params.id;

	// check for missing fields
	if(!id || id.length === 0) {
		return res.status(401).json({ err: true, message: "The id parameter is missing or incorrect" });
	}
	
	// check if credentials match race info in db
	const race = await db.getRace(id);
	if(!race) {
		return res.status(401).json({ err: true, message: "No race found with given id" });
	}

	return res.status(200).json({ 
		title: race.title,
	       	date: race.date,
		difficulty: race.difficulty,
		numParticipants: race.numParticipants,
		timeToSolve: race.timeToSolve,
		winner: race.winner
	});	
});

module.exports = router;
