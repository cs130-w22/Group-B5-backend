var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');

/* POST */
router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	// check for missing fields
	if(username == undefined || password == undefined) {
		res.sendStatus(401);
		return;
	}

	// check if credentials match user info in db
	db.getPassword(username, (val) => {
		var dbPass = val;

		// if password doesn't match or user not found
		if(dbPass == false || dbPass != password) {
			res.sendStatus(401);
			return;
		}
		
		// if credentials match, create JWT
		var privateKey = 'xEyduBGd5cHEbR58MNphCC2h0AgzjnCFr8UTMrjCZhl387p8I6MjFAR7szTFSw1';
		var token = jwt.sign(
			{ "user": username }, privateKey, { header: { "alg": "HS256", "typ": "JWT" } }
		);
		res.cookie('jwt', token);
		res.sendStatus(200);
		return;
	});
});

module.exports = router;
