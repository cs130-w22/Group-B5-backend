const model = require("mongoose").model;

const SchemaUser = require('./user');
const SchemaUserStats = require('./userStats');

module.exports = {
	User: model('user', SchemaUser),
	UserStats: model('userStats', SchemaUserStats)
};
