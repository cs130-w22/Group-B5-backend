const router = require('express').Router();
import * as db from '../db';

router.get('/:user', async function(req, res, next) {
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
	const races = stats[1];
	return res.status(200).json({ wins: wins, races: races });
});

module.exports = router;
