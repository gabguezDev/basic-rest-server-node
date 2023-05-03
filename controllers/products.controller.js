const { response } = require("express");

const jwt = require("jsonwebtoken");

const Product = require("../models/product");

const getProductByIdController = async (req, res = response) => {
	const { id } = req.params;

	const product = await Product.findById(id)
		.populate("user", "name")
		.populate("category", "name");

	if (!product) return res.json({ ok: false, msg: "Product does not exist." });

	return res.json({ ok: true, product });
};

const getProductsController = async (req, res = response) => {
	const { limit = 10, skip = 0 } = req.query;

	const askActiveProducts = { status: true };

	const [total, Products] = await Promise.all([
		Product.find(askActiveProducts)
			.limit(limit)
			.skip(skip)
			.populate("user", "name"),
		Product.countDocuments(askActiveProducts),
	]);

	return res.json({ total, Products });
};

const createProductController = async (req, res = response) => {
	const { name, price } = req.body;
	const token = req.headers["x-token"];

	const productExist = await Product.findOne({ name, status: true });

	if (productExist)
		return res.json({
			ok: false,
			msg: "Product already exist.",
		});

	const { uid: user } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

	const newProduct = new Product({ name, user, price });

	await newProduct.save();

	return res.json({
		ok: true,
		msg: "Product created succesfully",
		newProduct,
	});
};

const updateProductController = async (req, res = response) => {
	const { id } = req.params;

	const { status, user, ...data } = req.body;

	const updatedProduct = await Product.findByIdAndUpdate(id, data, {
		new: true,
	}).populate("category", "name");

	if (!updatedProduct || !updatedProduct.status)
		return res.json({
			ok: false,
			msg: "Product does not exist.",
		});

	return res.json({
		ok: true,
		msg: "Product updated succesfully.",
		updatedProduct,
	});
};

const deleteProductController = async (req, res = response) => {
	const { id } = req.params;

	const deletedProduct = await Product.findByIdAndUpdate(
		id,
		{ status: false },
		{
			new: true,
		}
	);

	if (!deletedProduct || !deletedProduct.status)
		return res.json({
			ok: false,
			msg: "Product does not exist.",
		});

	return res.json({
		ok: true,
		msg: "Product deleted succesfully.",
		deletedProduct,
	});
};

module.exports = {
	createProductController,
	updateProductController,
	deleteProductController,
	getProductByIdController,
	getProductsController,
};
