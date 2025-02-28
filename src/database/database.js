// src/database/Database.js
const mongoose = require('mongoose');

class Database {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.connection = null;
    }

    async connect() {
        try {
            await mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Database connection successful');
            this.connection = mongoose.connection;
        } catch (err) {
            console.error('Database connection error:', err.message);
            throw err; // Lança o erro para ser tratado externamente
        }
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.close();
            console.log('Mongoose disconnected from DB');
        }
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = Database;