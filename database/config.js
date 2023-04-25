const mongoose = require("mongoose");

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECTION_CNN);

		console.log("Database connected.");
	} catch (error) {
		console.log("DB error: ", error);
		throw new Error("Error at init the DB.");
	}
};

module.exports = { dbConnection };
