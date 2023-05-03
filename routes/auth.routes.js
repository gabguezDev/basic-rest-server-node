const { Router } = require("express");

const {
	loginController,
	googleAuthController,
} = require("../controllers/auth.controller");
const { check } = require("express-validator");
const {
	userStatusIsActive,
	emailLoginExist,
} = require("../helpers/db-validators");
const { fieldsValidator } = require("../middlewares/fields-validator");
const { googleVerify } = require("../helpers/google-verify");

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

router.post(
	"/google",
	[check("id_token", "id_token is required.").notEmpty(), fieldsValidator],
	googleAuthController
);

module.exports = router;
