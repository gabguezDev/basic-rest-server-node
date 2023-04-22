require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("../routes/users.routes");
const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();

		this.port = process.env.PORT;

		//API Routes
		this.apiRoutes = {
			users: "/api/users",
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
		this.app.use(this.apiRoutes.users, router);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server runing on port:", this.port);
		});
	}
}

module.exports = Server;
