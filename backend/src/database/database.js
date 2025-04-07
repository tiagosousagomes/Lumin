const mongoose = require("mongoose");
const chalk = require("chalk");

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
			console.log(chalk.green("[MongoDB] Connected successfully."));
			this.connection = mongoose.connection;

			this.connection.on("connected", () => {
				console.log(chalk.green("[MongoDB] Mongoose connected to DB"));
			});

			this.connection.on("disconnected", () => {
				console.log(chalk.red("[MongoDB] Mongoose disconnected from DB"));
			});

			this.connection.on("error", (err) => {
				console.log(chalk.red("[MongoDB] Connection error:", err.message));
			});
		} catch (err) {
			console.log(chalk.red("[MongoDB] Initial connection error:", err.message));
			throw err;
		}
	}

	async disconnect() {
		if (this.connection) {
			await this.connection.close();
			console.log(chalk.yellow("[MongoDB] Mongoose disconnected from DB"));
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
