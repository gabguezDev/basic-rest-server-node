const { Router } = require("express");

const {
	usersGetController,
	usersPostController,
	usersPutController,
	usersDeleteController,
} = require("../controllers/users.controller");

const { check, query } = require("express-validator");
const { fieldsValidator } = require("../middlewares/fields-validator");
const {
	isRoleValid,
	emailRegisterExist,
	userExist,
	userIsActiveById,
	isAdminRole,
} = require("../helpers/db-validators");
const { validateJwt } = require("../middlewares/validate-jwt");

const router = Router();

// REQS Handlers
router.get(
	"/",
	[
		validateJwt,
		query("limit", "Limit must be a number").if(
			query("limit").notEmpty().isNumeric({ no_symbols: false })
		),
		query("skip", "Skip must be a number").if(
			query("limit").notEmpty().isNumeric({ no_symbols: false })
		),
		fieldsValidator,
	],
	usersGetController
);

router.post(
	"/",
	[
		check("email", "El email debe ser válido.")
			.not()
			.isEmpty()
			.trim()
			.isEmail()
			.custom(emailRegisterExist),
		check("name", "El Nombre es obligatorio.")
			.not()
			.isEmpty()
			.trim()
			.isLength({ min: 3, max: 30 }),
		check("lastName", "El Apellido es obligatorio.")
			.not()
			.isEmpty()
			.trim()
			.isLength({ min: 3, max: 30 }),
		check("password", "El password debe contener entre 7 y 20 caracteres.")
			.not()
			.isEmpty()
			.trim()
			.isLength({ min: 7, max: 20 }),
		check("role", "Role must exist.").not().isEmpty().custom(isRoleValid),
		fieldsValidator,
	],
	usersPostController
);

router.put(
	"/:id",
	[
		validateJwt,
		check("id", "Debe ser un id válido.")
			.isMongoId()
			.custom(userExist)
			.custom(userIsActiveById),
		check("name", "El Nombre es obligatorio.").if(
			check("lastName").notEmpty().trim().isLength({ min: 3, max: 30 })
		),
		check("lastName", "El Apellido es obligatorio.").if(
			check("lastName").notEmpty().trim().isLength({ min: 3, max: 30 })
		),
		check("password", "El password debe contener entre 7 y 20 caracteres.").if(
			check("password").notEmpty().trim().isLength({ min: 7, max: 20 })
		),
		check("role", "Role must exist.").if(
			check("role").notEmpty().custom(isRoleValid)
		),
		fieldsValidator,
	],
	usersPutController
);

router.delete(
	"/:id",
	[
		validateJwt,
		check("id", "Debe ser un id válido.")
			.isMongoId()
			.custom(userExist)
			.custom(userIsActiveById)
			.custom(isAdminRole),
		fieldsValidator,
	],
	usersDeleteController
);

module.exports = router;
