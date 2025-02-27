const express = require("express");
const userRoutes = require("../src/routes/userRoute.js")

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usar as rotas de usuário
app.use('/users', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});