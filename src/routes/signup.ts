const router = require('express').Router();
import * as db from '../db';

/* POST */
router.post('/', async function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	// check for missing fields
	if(username == undefined || password == undefined ||
	   username.length == 0 || password.length == 0) {
		return res.status(400).json({ err: true, message: "One or more fields are missing or incorrect" });
	}

	// try adding new user
	let success = await db.addNewUser(username, password);
	if(success) {
		return res.status(201).json({ err: false, message: "User successfully added to database" });
	} else {
		return res.status(401).json({ err: true, message: "Given username already exists in database" });
	}
});

module.exports = router;
