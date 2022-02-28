const model = require("mongoose").model;

const SchemaUser = require('./user');
const SchemaUserStats = require('./userStats');
const SchemaRace = require('./race');
const SchemaUserHistory = require('./userHistory');

module.exports = {
	User: model('user', SchemaUser),
	UserStats: model('userStats', SchemaUserStats),
	Race: model('race', SchemaRace),
	UserHistory: model('userHistory', SchemaUserHistory)
};
