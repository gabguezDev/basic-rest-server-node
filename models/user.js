const { Schema, model } = require("mongoose");

const UserSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		enum: ["ADMIN", "CLIENT"],
	},
	status: {
		type: Boolean,
		required: true,
	},
});

UserSchema.methods.toJSON = function () {
	const { __v, password, status, ...user } = this.toObject();

	return user;
};

module.exports = model("User", UserSchema, "users");