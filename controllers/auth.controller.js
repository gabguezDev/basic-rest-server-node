const { response } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { googleVerify } = require("../helpers/google-verify");

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

const googleAuthController = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { email, given_name, family_name, picture } = await googleVerify(
			id_token
		);

		const user = await User.findOne({ email });

		//In case of non registered user, code below will register it
		if (!user || !user.status) {
			const newGoogleUser = new User({
				email,
				name: given_name,
				lastName: family_name,
				img: picture,
				password: "generic_password",
			});

			await newGoogleUser.save();

			return res.json({
				msg: "User registered with Google succesfully.",
				...newGoogleUser,
			});
		}

		console.log("user ....>", user);

		// In case of registered user, will login
		const { uid, ...userData } = user.toJSON();
		const token = jwt.sign({ uid }, process.env.SECRETORPRIVATEKEY);

		return res.json({
			msg: "User succesfully logged in with Google",
			uid,
			token,
			userData,
		});
	} catch (error) {
		return res.json({ error });
	}
};

module.exports = {
	googleAuthController,
	loginController,
};
