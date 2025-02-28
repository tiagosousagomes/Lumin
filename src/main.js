// src/main.js
const express = require('express');
const Database = require('./database/database');
const userRoutes = require('./routes/userRoute');

// Configurações do Express
const app = express();
app.use(express.json());

// Conectar ao banco de dados
const db = new Database("mongodb+srv://admin123:admin123@lumin.qdtl0.mongodb.net/?retryWrites=true&w=majority&appName=Lumin");

db.connect()
    .then(() => {
        console.log('Database connected successfully');

        // Rotas
        app.use('/users', userRoutes);

        // Iniciar o servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1); // Encerra o processo em caso de erro
    });