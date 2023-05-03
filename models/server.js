require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usersRouter = require("../routes/users.routes");
const authRouter = require("../routes/auth.routes");
const productsRouter = require("../routes/products.routes");
const categoriesRouter = require("../routes/categories.routes");
const searchRouter = require("../routes/search.routes");

const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();

		this.port = process.env.PORT;

		//API Routes
		this.apiRoutes = {
			public: "/",
			products: "/api/products",
			categories: "/api/categories",
			users: "/api/users",
			auth: "/api/auth",
			search: "/api/search",
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

		// Public directory
		this.app.use(this.apiRoutes.public, express.static("public"));
	}

	connectDb() {
		dbConnection();
	}

	routes() {
		this.app.use(this.apiRoutes.products, productsRouter);
		this.app.use(this.apiRoutes.categories, categoriesRouter);
		this.app.use(this.apiRoutes.users, usersRouter);
		this.app.use(this.apiRoutes.auth, authRouter);
		this.app.use(this.apiRoutes.search, searchRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server runing on port:", this.port);
		});
	}
}

module.exports = Server;
