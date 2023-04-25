const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async role => {
	const roleExist = await Role.findOne({ role });

	if (!roleExist) {
		throw new Error(`Role "${role}" does not exist in DB.`);
	}
};

const isAdminRole = role => {
	if (role !== "ADMIN") {
		throw new Error(`You do not have permission to do this action.`);
	}
};

const emailRegisterExist = async email => {
	//Verify if email is already in use
	const emailExist = await User.findOne({ email });

	if (emailExist && emailExist.status) {
		throw new Error("Email already in use.");
	}
};

const userExist = async id => {
	//Verify if email is already in use
	const userExist = await User.findById(id);

	if (!userExist) {
		throw new Error("User does not exists.");
	}
};

const emailLoginExist = async email => {
	// Verify if user exist
	const loggedUser = await User.findOne({ email });

	if (!loggedUser) {
		throw new Error("Credentials are not correct - email.");
	}
};

const userIsActiveById = async id => {
	//Verify if email is already in use
	const { status } = await User.findById(id);

	if (!status) {
		throw new Error("User does not exist ;-).");
	}
};

const userIsActiveByEmail = async email => {
	//Verify if email is already in use
	const { status } = await User.findOne({ email });

	if (!status) {
		throw new Error("User does not exist ;-).");
	}
};

const userStatusIsActive = async email => {
	// Verify if user is active

	const { status } = await User.findOne({ email });

	if (!status) {
		return res.status(401).json({
			msg: "Credentials are not correct - email.",
		});
	}
};

module.exports = {
	isRoleValid,
	userExist,
	userIsActiveByEmail,
	userIsActiveById,
	emailRegisterExist,
	emailLoginExist,
	userStatusIsActive,
	isAdminRole,
};
