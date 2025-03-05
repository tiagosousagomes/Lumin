const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoute'); 
const postRoutes = require('./src/routes/postRoute')
const likeRoutes = require('./src/routes/likeroute')

// Carregando as variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializando o Express
const app = express();

// Middleware para transformar tudo em JSON
app.use(express.json());

// Conecta ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Banco de dados conectado com sucesso!');

        // Rotas
        app.use('/users', userRoutes);
        app.use('/posts',postRoutes);
        app.use('/likes',likeRoutes)

        // Inicia o servidor
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Servidor rodando...`);
        });
    })
    .catch(err => {
        console.error('Falha ao conectar com o banco de dados', err.message);
        process.exit(1); // Encerra o processo em caso de erro
    });