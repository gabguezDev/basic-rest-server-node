const { Router } = require("express");

const { loginController } = require("../controllers/auth.controller");
const { check } = require("express-validator");
const {
	userStatusIsActive,
	emailLoginExist,
} = require("../helpers/db-validators");
const { fieldsValidator } = require("../middlewares/fields-validator");

const router = Router();

router.post(
	"/login",
	[
		check("email", "Email is required")
			.notEmpty()
			.isEmail()
			.custom(emailLoginExist)
			.custom(userStatusIsActive),
		check("password", "Password is required.")
			.notEmpty()
			.isLength({ min: 7, max: 20 }),
		fieldsValidator,
	],
	loginController
);

module.exports = router;
