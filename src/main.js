// src/main.js
const express = require('express');

const userRoutes = require('./routes/userRoute');
const database = require('./database/database');

// Configurações do Express
const app = express();
app.use(express.json());

// Conectar ao banco de dados
const db = database("mongodb+srv://admin123:admin123@lumin.qdtl0.mongodb.net/?retryWrites=true&w=majority&appName=Lumin");

db.connect()
    .then(() => {
        console.log('Database connected successfully');

        // Rotas
        app.use('/users', userRoutes);

        // Iniciar o servidor
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1); // Encerra o processo em caso de erro
    });