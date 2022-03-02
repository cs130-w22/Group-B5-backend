const model = require("mongoose").model;

const SchemaUser = require('./user');
const SchemaRace = require('./race');
const SchemaUserHistory = require('./userHistory');

module.exports = {
	User: model('user', SchemaUser),
	Race: model('race', SchemaRace),
	UserHistory: model('userHistory', SchemaUserHistory)
};
