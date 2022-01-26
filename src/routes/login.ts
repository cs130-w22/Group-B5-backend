var express = require('express');
var router = express.Router();
var db = require('../db');

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
		if(dbPass == false) {
			res.sendStatus(401);
			return;
		}
		
		// if credentials match
		res.sendStatus(200);
		return;
	});
});

module.exports = router;
