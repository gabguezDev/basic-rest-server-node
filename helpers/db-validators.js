const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async role => {
	const roleExist = await Role.findOne({ role });

	if (!roleExist) {
		throw new Error(`Role "${role}" does not exist in DB.`);
	}
};

const emailExist = async email => {
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

const userIsActive = async id => {
	//Verify if email is already in use
	const { status } = await User.findById(id);

	if (!status) {
		throw new Error("User does not exist ;-).");
	}
};

module.exports = { isRoleValid, emailExist, userExist, userIsActive };
