const mongoose = require("mongoose");

class Database {
  constructor(connectionString) {
    if (!connectionString) {
      throw new error("Connection is a required!");
    }
    this.connectionString = connectionString;
    this.connection = null;
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString, {
        useNewUrlParser: true, //evita aviso de depreciação
        useUnifiedTopology: true,
      });
      console.log("Database Connect!");
      this.connection = mongoose.connection;

      this.connection.on("connected", () => {
        console.log("Mongoose connected to DB");
      });

      this.connection.on("disconnect", () => {
        console.log("Mongoose disconnect from DB");
      });

      this.connection.on("error", () => {
        console.log("Mongoose connection error:", err.message);
      });
    } catch (err) {
      console.log("Database connection error:", err.message);
      throw err;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      console.log("Mongoose disconnected from DB");
    }
  }

  getConnection() {
    if (!this.connection) {
      throw new error("No active connection BD");
    }
    return this.connection;
  }
}

let instance = null;

module.exports = (connectionString) => {
  if (!instance) {
    instance = new Database(connectionString);
  }
  return instance;
};
