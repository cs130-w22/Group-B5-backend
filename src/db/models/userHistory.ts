import { Schema, ObjectId } from 'mongoose';

const UserHistory = new Schema({
	name: {
		type: String,
		required: true,
	},
	// ObjectId of a Race Schema
	race: {
		type: Schema.Types.ObjectId,
		required: true
	},
	won: {
		type: Boolean,
		required: true
	}
});

module.exports = UserHistory;
export { UserHistory };
