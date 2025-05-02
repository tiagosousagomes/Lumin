const mongoose = require("mongoose");
const logger = require('../utils/utils')

class Database {
	constructor(connectionString) {
		if (!connectionString) {
			throw new Error("Connection is required!");
		}
		this.connectionString = connectionString;
		this.connection = null;
	}

	async connect() {
		try {
			await mongoose.connect(this.connectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			logger.db("Connected successfully.");
			this.connection = mongoose.connection;

			this.connection.on("connected", () => {
				logger.db("Mongoose connected to DB");
			});

			this.connection.on("disconnected", () => {
				logger.info("Mongoose disconnected from DB");
			});

			this.connection.on("error", (err) => {
				logger.error("Connection error:", err.message);
			});
		} catch (err) {
			logger.error("Initial connection error:", err.message);
			throw err;
		}
	}

	async disconnect() {
		if (this.connection) {
			await this.connection.close();
			logger.info(" Mongoose disconnected from DB");
		}
	}

	getConnection() {
		if (!this.connection) {
			throw new Error("No active connection to the database.");
		}
		return this.connection;
	}
}

let instance = null;

module.exports = (connectionString) => {
	if (!instance) {
		instance = new Database(connectionString);
		Object.freeze(instance);
	}
	return instance;
};
