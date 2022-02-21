const router = require('express').Router();
const jwt = require('jsonwebtoken')
import * as db from '../db';
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

router.post('/login', async function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	// check for missing fields
	if(!username || !password || username.length === 0 || password.length === 0) {
		return res.status(401).json({ err: true, message: "The username or password fields are missing or incorrect" });
	}

	// check if credentials match user info in db
	let match = await db.checkPassword(username, password);
	if(match) {
		// if credentials match, create JWT
		let token = jwt.sign(
			{ "user": username }, privateKey, { header: { "alg": "HS256", "typ": "JWT" } }
		);
		return res.status(200).json({ token, err: false, message: "Authentication successful" });
	} else {
		// else, return error
		return res.status(401).json({ err: true, message: "No user found with given login info" });
	}
});


/* POST */
router.post('/signup', async function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	// check for missing fields
	if(!username || !password || username.length === 0 || password.length === 0) {
		return res.status(400).json({ err: true, message: "One or more fields are missing or incorrect" });
	}

	// try adding new user
	let success = await db.addNewUser(username, password);
	if(success) {
		let token = jwt.sign(
			{ "user": username }, privateKey, { header: { "alg": "HS256", "typ": "JWT" } }
		);
		return res.status(201).json({ err: false, message: "User signed up successfully", token });
	} else {
		return res.status(401).json({ err: true, message: "Given username already exists in database" });
	}
});

router.post('/verify', async (req, res) => {
	let {token, username} = req.body;

	if(!token || !username || token.length === 0 ) {
		return res.status(400).json({ verified: false, message: "Missing JWT token or username in request body" });
	}

	try {
		let attempt = jwt.verify(token, privateKey);
		if(!attempt.user === username) throw new Error()

		return res.status(200).json({ verified: true, message: "JWT is valid for user {}" });
	} catch(e){
		return res.status(401).json({ verified: false, message: "Invalid JWT token." });
	}

})

module.exports = router;
