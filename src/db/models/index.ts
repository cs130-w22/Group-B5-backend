const model = require("mongoose").model;

const SchemaUser = require('./user');
const SchemaRace = require('./race');
const SchemaUserHistory = require('./userHistory');

const User = model('user', SchemaUser);
const Race = model('race', SchemaRace);
const UserHistory = model('userHistory', SchemaUserHistory);

module.exports = {
	User: User,
	Race: Race,
	UserHistory: UserHistory
};

export { User, Race, UserHistory };
