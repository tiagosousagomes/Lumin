const express = require("express")
const userController = require("../controllers/userController")

const router = express.Router();

// Rota para criar um usuário (POST /users)
router.post('/', userController.CreateUser);

// Rota para atualizar um usuário (PUT /users/:id)
module.exports = router; // Usando CommonJS