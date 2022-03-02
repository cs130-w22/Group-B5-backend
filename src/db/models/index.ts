const model = require("mongoose").model;

const SchemaUser = require('./user');
const SchemaRace = require('./race');
const SchemaUserHistory = require('./userHistory');
const SchemaUserProblem = require('./userProblem');

module.exports = {
	User: model('user', SchemaUser),
	Race: model('race', SchemaRace),
	UserHistory: model('userHistory', SchemaUserHistory),
	UserProblem: model('userProblem', SchemaUserProblem)
};
