const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoute'); 
const postRoutes = require('./src/routes/postRoute')// Ajuste o caminho conforme necessário

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializar o Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database connected successfully');

        // Rotas
        app.use('/users', userRoutes);
        app.use('/posts',postRoutes)

        // Iniciar o servidor
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server running`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1); // Encerra o processo em caso de erro
    });