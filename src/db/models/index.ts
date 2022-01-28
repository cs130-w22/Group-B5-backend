const model = require("mongoose").model;

const SchemaUser = require('./user')

module.exports = {
	User: model('user', SchemaUser)
};
