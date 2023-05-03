const { Router } = require("express");

const { query } = require("express-validator");

const { searchController } = require("../controllers/search.controller");

const { fieldsValidator } = require("../middlewares/fields-validator");

const router = Router();

router.get(
	"/:collection",
	[query("term").isString(), fieldsValidator],
	searchController
);

module.exports = router;
