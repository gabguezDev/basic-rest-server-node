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
		default: "CLIENT",
		enum: ["ADMIN", "CLIENT"],
	},
	status: {
		type: Boolean,
		required: true,
		default: true,
	},
	img: {
		type: String,
		required: false,
	},
});

UserSchema.methods.toJSON = function () {
	const { __v, password, _id, status, ...user } = this.toObject();
	user.uid = _id;
	return user;
};

module.exports = model("User", UserSchema, "users");
