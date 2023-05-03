const { validationResult } = require("express-validator");

const fieldsValidator = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			ok: false,
			errors: [
				...errors.array({ onlyFirstError: true }).map(({ msg, path }) => ({
					msg: msg,
					detectedAt: path,
				})),
			],
		});
	}

	next();
};

module.exports = { fieldsValidator };
