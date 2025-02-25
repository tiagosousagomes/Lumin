const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes'); 

const app = express();

    connectDB();

    app.use(bodyParser.json());

    app.use('/api', userRoutes);
    app.use('/api', postRoutes);

const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);

    })