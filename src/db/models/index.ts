var model = require("mongoose").model;

var SchemaUser = require('./user')

module.exports = {
	User: model('user', SchemaUser)
};
