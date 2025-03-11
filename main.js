const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoute'); 
const postRoutes = require('./src/routes/postRoute')
const likeRoutes = require('./src/routes/likeroute')
const commentRoutes = require('./src/routes/commentRoute');
const followerRoutes = require('./src/routes/followerRoute');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Banco de dados conectado com sucesso!');

        app.use('/users', userRoutes);
        app.use('/posts',postRoutes);
        app.use('/likes',likeRoutes)
        app.use('/comments', commentRoutes);
        app.use('/follow', followerRoutes)

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