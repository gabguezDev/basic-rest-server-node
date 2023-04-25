const { response } = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const loginController = async (req, res = response) => {
	const { email, password } = req.body;

	const loggedUser = await User.findOne({ email });

	const { _id: uid, password: passwordDB } = loggedUser;

	// Verify password with db
	const validPassword = bcrypt.compareSync(password, passwordDB);

	if (!validPassword) {
		return res.status(401).json({
			msg: "Credentials are not correct - password.",
		});
	}

	// Generate JWT
	const token = jwt.sign({ uid }, process.env.SECRETORPRIVATEKEY);

	return res.json({ token });
};

module.exports = {
	loginController,
};
