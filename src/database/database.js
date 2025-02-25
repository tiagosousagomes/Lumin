const mongoose = require("mongoose");

const server = "localhost:27017"; // Porta corrigida para 27017
const database = "nexora";

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`, {
            useNewUrlParser: true, // Evita avisos de depreciação
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Database connection successful');
        })
        .catch(err => {
            console.error('Database connection error:', err.message); // Exibe o erro detalhado
        });

        // Eventos adicionais para monitorar a conexão
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from DB');
        });
    }
}

module.exports = new Database();