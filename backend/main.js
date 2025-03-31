const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require("cors");
const { initializeSocket } = require('./socket');
const userRoutes = require('./src/routes/userRoute');
const postRoutes = require('./src/routes/postRoute');
const likeRoutes = require('./src/routes/likeroute');
const commentRoutes = require('./src/routes/commentRoute');
const messagesRoutes = require('./src/routes/messageRoute');
const followerRoutes = require('./src/routes/followerRoute');
const { swaggerUi, specs } = require("./swagger");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Banco de dados conectado com sucesso!');

        app.use('/api', userRoutes);
        app.use('/api', postRoutes);
        app.use('/api', likeRoutes);
        app.use('/api', commentRoutes);
        app.use('/api', followerRoutes);
        app.use('/api', messagesRoutes);
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

        initializeSocket(server);

        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Falha ao conectar com o banco de dados', err.message);
        process.exit(1);
    });
