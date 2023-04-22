const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
	role: {
		type: String,
		required: true,
		enum: ["CLIENT", "ADMIN"],
	},
});

module.exports = model("Role", RoleSchema, "roles");
