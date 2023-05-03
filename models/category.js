const { Schema, model, default: mongoose } = require("mongoose");

const CategorySchema = Schema({
	name: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	status: {
		type: Boolean,
		required: true,
		default: true,
	},
});

CategorySchema.methods.toJSON = function () {
	const { __v, status, ...data } = this.toObject();
	return data;
};

module.exports = model("Category", CategorySchema, "categories");
