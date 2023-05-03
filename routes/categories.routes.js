const { Router } = require("express");

const { check, query } = require("express-validator");

const { fieldsValidator } = require("../middlewares/fields-validator");

const {
	createCategoryController,
	updateCategoryController,
	deleteCategoryController,
	getCategoryByIdController,
	getCategoriesController,
} = require("../controllers/categories.controller");

const { validateJwt } = require("../middlewares/validate-jwt");

const { isAdminRole } = require("../helpers/db-validators");

const router = Router();

// Create Category
router.post(
	"/",
	[
		validateJwt,
		check("x-token").custom(isAdminRole),
		check("name", "Name must exist.").not().isEmpty(),
		fieldsValidator,
	],
	createCategoryController
);

// Get all Categorys with pagination
router.get(
	"/",
	[
		query("limit", "Limit must be a number").if(
			query("limit").notEmpty().isNumeric({ no_symbols: false })
		),
		query("skip", "Skip must be a number").if(
			query("limit").notEmpty().isNumeric({ no_symbols: false })
		),
		fieldsValidator,
	],
	getCategoriesController
);

// Get Category by id
router.get(
	"/:id",
	[check("id", "Id no válido.").isMongoId(), fieldsValidator],
	getCategoryByIdController
);

// Update Category by id
router.put(
	"/:id",
	[
		validateJwt,
		check("x-token").custom(isAdminRole),
		check("id", "Id no válido.").isMongoId(),
		check("name", "Name must exist.").notEmpty(),
		fieldsValidator,
	],
	updateCategoryController
);

// Delete Category by id
router.delete(
	"/:id",
	[
		validateJwt,
		check("x-token").custom(isAdminRole),
		check("id", "Id no válido.").isMongoId(),
		fieldsValidator,
	],
	deleteCategoryController
);

module.exports = router;
