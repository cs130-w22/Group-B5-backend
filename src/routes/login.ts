const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

/* POST */
router.post('/', async function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	// check for missing fields
	if(username == undefined || password == undefined || 
	   username.length == 0 || password.length == 0) {
		return res.status(401).json({ err: true, message: "The username or password fields are missing or incorrect" });
	}

	// check if credentials match user info in db
	let match = await db.checkPassword(username, password);
	if(match) {
		// if credentials match, create JWT
		let privateKey = 'xEyduBGd5cHEbR58MNphCC2h0AgzjnCFr8UTMrjCZhl387p8I6MjFAR7szTFSw1';
		let token = jwt.sign(
			{ "user": username }, privateKey, { header: { "alg": "HS256", "typ": "JWT" } }
		);
		return res.status(200).json({ token, err: false, message: "Authentication successful" });
	} else {
		// else, return error
		return res.status(401).json({ err: true, message: "No user found with given login info" });
	}
});

module.exports = router;
