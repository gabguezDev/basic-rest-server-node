require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRouter = require("../routes/users.routes");
const authRouter = require("../routes/auth.routes");
const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();

		this.port = process.env.PORT;

		//API Routes
		this.apiRoutes = {
			users: "/api/users",
			auth: "/api/auth",
		};

		this.connectDb();

		this.middlewares();

		this.routes();
	}

	middlewares() {
		//CORS
		this.app.use(cors());

		//Read & parse of body
		this.app.use(express.json());
	}

	connectDb() {
		dbConnection();
	}

	routes() {
		this.app.use(this.apiRoutes.users, usersRouter);
		this.app.use(this.apiRoutes.auth, authRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server runing on port:", this.port);
		});
	}
}

module.exports = Server;
