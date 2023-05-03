const { response } = require("express");

const jwt = require("jsonwebtoken");

const Category = require("../models/category");

const getCategoryByIdController = async (req, res = response) => {
	const { id } = req.params;

	const category = await Category.findById(id).populate("user", "name");

	if (!category)
		return res.json({ ok: false, msg: "Category does not exist." });

	return res.json({ ok: true, category });
};

const getCategoriesController = async (req, res = response) => {
	const { limit = 10, skip = 0 } = req.query;

	const askActiveCategories = { status: true };

	const [total, categories] = await Promise.all([
		Category.countDocuments(askActiveCategories),
		Category.find(askActiveCategories)
			.limit(limit)
			.skip(skip)
			.populate("user", "name"),
	]);

	return res.json({ total, categories });
};

const createCategoryController = async (req, res = response) => {
	const { name } = req.body;
	const token = req.headers["x-token"];

	const categoryExist = await Category.findOne({ name, status: true });

	if (categoryExist)
		return res.json({
			ok: false,
			msg: "Category already exist.",
		});

	const { uid: user } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

	const newCategory = new Category({ name, user });

	await newCategory.save();

	return res.json({
		ok: true,
		msg: "Category created succesfully",
		newCategory,
	});
};

const updateCategoryController = async (req, res = response) => {
	const { id } = req.params;

	const { name } = req.body;

	const updatedCategory = await Category.findByIdAndUpdate(
		id,
		{ name },
		{
			new: true,
		}
	);

	if (!updatedCategory || !updatedCategory.status)
		return res.json({
			ok: false,
			msg: "Category does not exist.",
		});

	return res.json({
		ok: true,
		msg: "Category updated succesfully.",
		updatedCategory,
	});
};

const deleteCategoryController = async (req, res = response) => {
	const { id } = req.params;

	const deletedCategory = await Category.findByIdAndUpdate(
		id,
		{ status: false },
		{
			new: true,
		}
	);

	if (!deletedCategory || !deletedCategory.status)
		return res.json({
			ok: false,
			msg: "Category does not exist.",
		});

	return res.json({
		ok: true,
		msg: "Category deleted succesfully.",
		deletedCategory,
	});
};

module.exports = {
	createCategoryController,
	updateCategoryController,
	deleteCategoryController,
	getCategoryByIdController,
	getCategoriesController,
};
