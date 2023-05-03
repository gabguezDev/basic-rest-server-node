const { Router } = require("express");

const { check, query } = require("express-validator");

const { fieldsValidator } = require("../middlewares/fields-validator");

const { isAdminRole } = require("../helpers/db-validators");

const router = Router();

const {
	createProductController,
	updateProductController,
	deleteProductController,
	getProductByIdController,
	getProductsController,
} = require("../controllers/products.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

// Create Product
router.post(
	"/",
	[
		validateJwt,
		check("name", "Name must exist.").not().isEmpty().isString(),
		check("price", "Price must exist.").not().isEmpty().isString(),
		// check("img", "Img must be a URL.").isURL({ protocols: ["http" | "https"] }),
		fieldsValidator,
	],
	createProductController
);

// Get all Products with pagination
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
	getProductsController
);

// Get Product by id
router.get(
	"/:id",
	[check("id", "Id no válido.").isMongoId(), fieldsValidator],
	getProductByIdController
);

// Update Product by id
router.put(
	"/:id",
	[
		validateJwt,
		check("x-token").custom(isAdminRole),
		check("id", "Id no válido.")
			.if(check("id", "Id no válido.").not().isEmpty())
			.isMongoId(),
		check("name", "Name must exist.").if(
			check("id", "Id no válido.").not().isEmpty().isString()
		),
		check("price", "Price must exist.").if(
			check("id", "Id no válido.").not().isEmpty().isString()
		),
		fieldsValidator,
	],
	updateProductController
);

// Delete Product by id
router.delete(
	"/:id",
	[
		validateJwt,
		check("x-token").custom(isAdminRole),
		check("id", "Id no válido.").isMongoId(),
	],
	deleteProductController
);

module.exports = router;
