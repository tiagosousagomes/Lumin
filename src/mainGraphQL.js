const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); 

require('dotenv').config({path: '../.env' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Banco de dados conectado com sucesso!');

        app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: true
        }));

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Falha ao conectar com o banco de dados', err.message);
        process.exit(1);
    });