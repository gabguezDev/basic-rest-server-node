const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJwt = (req, res = response, next) => {
	const token = req.header("x-token");

	jwt.verify(token, process.env.SECRETORPRIVATEKEY, (error, verifiedJwt) => {
		if (error) {
			res.status(403).json({
				msg: "Invalid token.",
			});
		} else {
			next();
		}
	});
};

module.exports = {
	validateJwt,
};
