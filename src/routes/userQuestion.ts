const router = require('express').Router();
const jwt = require('jsonwebtoken')
import * as db from '../db';
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

router.post('/submit', async (req, res, next) => {
	let {name, description, testcases} = req.body;

	if(!name) {
		return res.status(400).json({ err: true, message: "Please include a title for your question" });
	}

    if(!description) {
		return res.status(400).json({ err: true, message: "Please include a description for your question" });
	}

    if(!testcases) {
		return res.status(400).json({ err: true, message: "Please include testcases for your question" });
	}

	var arrayLength = testcases.length;
	for (var i = 0; i < arrayLength; i++) {
		if (!testcases[i].hasOwnProperty("input") || !testcases[i].hasOwnProperty("output")) {
			return res.status(400).json({ err: true, message: "Please include to specify an input and output for each test case" });
		}
	}

	let success = await db.addUserProblem(name, description, testcases);

	if(success) {
		return res.status(201).json({ err: false, message: "Question submitted up successfully"});
	} else {
		return res.status(401).json({ err: true, message: "Question already exists in database" });
	}
	
})

router.get('/:id', async function(req, res, next) {
	var id = req.params.id;

	if(!id || id.length === 0) {
		return res.status(401).json({ err: true, message: "The id parameter is missing or incorrect" });
	}
	
	// check if credentials match race info in db
	const userProblem = await db.getUserProblem(id);
	
	if (userProblem === null) {
		return res.status(401).json({
			err: true,
			message: "Question could not be retrieved",
		});	
	}


	return res.status(200).json({
		err: false,
		message: "Question retrieved",
		res: userProblem
	});	
});

module.exports = router;