const { response } = require("express");

const { isValidObjectId } = require("mongoose");

const Product = require("../models/product");
const User = require("../models/user");
const Category = require("../models/category");
const Role = require("../models/role");

const allowedCollections = ["users", "categories", "roles", "products"];

const searchUsers = async (term = "", res = response) => {
	const isMongoId = isValidObjectId(term);

	if (isMongoId) {
		const user = await User.findById(term).$where({ status: true });
		return res.json({ result: user ? [user] : [] });
	}

	const regex = new RegExp(term, "i");

	const users = await User.find({
		$or: [{ name: regex }, { email: regex }],
		$and: [{ status: true }],
	});

	return res.json({ results: users ? [users] : [] });
};

const searchCategories = async (term = "", res = response) => {
	const isMongoId = isValidObjectId(term);

	if (isMongoId) {
		const category = await Category.findById(term).$where({ status: true });
		return res.json({ result: category ? category : [] });
	}

	const regex = new RegExp(term, "i");

	const categories = await Category.find({
		$or: [{ name: regex }],
		$and: [{ status: true }],
	});

	return res.json({ results: categories ? categories : [] });
};

const searchProducts = async (term = "", res = response) => {
	const isMongoId = isValidObjectId(term);

	if (isMongoId) {
		const product = await Product.findById(term).$where({ status: true });
		return res.json({ result: product ? product : [] });
	}

	const regex = new RegExp(term, "i");

	const products = await Product.find({
		$or: [{ name: regex, price: regex }],
		$and: [{ status: true }],
	});

	return res.json({ results: products ? products : [] });
};

const searchRoles = async (term = "", res = response) => {
	const isMongoId = isValidObjectId(term);

	if (isMongoId) {
		const role = await Role.findById(term);
		return res.json({ result: role ? role : [] });
	}

	const regex = new RegExp(term, "i");

	const roles = await Role.find({ role: regex });

	return res.json({ results: roles ? roles : [] });
};

const searchController = async (req, res = response) => {
	const { collection } = req.params;
	const { term } = req.query;

	switch (collection) {
		case "users":
			await searchUsers(term, res);
			break;
		case "categories":
			await searchCategories(term, res);
			break;
		case "products":
			await searchProducts(term, res);
			break;
		case "roles":
			await searchRoles(term, res);
			break;

		default:
			return res.json({
				ok: false,
				msg: `Allowed collections are: ${allowedCollections.join(" ")}`,
			});
	}
};

module.exports = { searchController };
