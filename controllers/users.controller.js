const { response } = require("express");

const User = require("../models/user");

const bcrypt = require("bcrypt");

// Filter by active users

const usersGetController = async (req, res = response) => {
	const { limit = 10, skip = 0 } = req.query;
	const askActiveUsers = { status: true };

	const [total, users] = await Promise.all([
		User.countDocuments(askActiveUsers),
		User.find(askActiveUsers).limit(parseInt(limit)).skip(parseInt(skip)),
	]);

	res.json({
		ok: true,
		total,
		users,
	});
};

const usersPostController = async (req, res = response) => {
	const { name, lastName, email, password, role } = req.body;

	//Instance new user
	const newUser = new User({
		name,
		lastName,
		email,
		password,
		role,
		status: true,
	});

	// Encrypt the pass
	const salt = bcrypt.genSaltSync();
	newUser.password = bcrypt.hashSync(password, salt);

	//Save in db
	await newUser.save();

	return res.json({
		msg: "User created succesfuly.",
		newUser,
	});
};

const usersPutController = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, email, ...dataToUpdate } = req.body;

	try {
		const updatedUser = await User.findByIdAndUpdate(id, dataToUpdate, {
			new: true,
		});

		// If password has been sent, encrypt it
		if (password) {
			const salt = bcrypt.genSaltSync();
			updatedUser.password = bcrypt.hashSync(password, salt);
			await updatedUser.save();
		}

		return res.json({
			msg: "User updated succesfuly.",
			updatedUser,
		});
	} catch (error) {
		return res.json({
			msg: "Error has been ocurred.",
			error,
		});
	}
};

const usersDeleteController = async (req, res = response) => {
	const { id } = req.params;

	try {
		const deletedUser = await User.findByIdAndUpdate(
			id,
			{ status: false },
			{
				new: true,
			}
		);

		return res.json({
			msg: "User deleted succesfuly.",
			deletedUser,
		});
	} catch (error) {
		return res.json({
			msg: "Error has been ocurred.",
			error,
		});
	}
};

module.exports = {
	usersGetController,
	usersPostController,
	usersPutController,
	usersDeleteController,
};
