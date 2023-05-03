const { Schema, model, default: mongoose } = require("mongoose");

const ProductSchema = Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
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

ProductSchema.methods.toJSON = function () {
	const { __v, status, ...data } = this.toObject();
	return data;
};

module.exports = model("Product", ProductSchema, "products");
