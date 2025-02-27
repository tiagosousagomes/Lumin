const mongoose = require("mongoose");

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb+srv://Admin:nimda@cluster0.qdtl0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
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