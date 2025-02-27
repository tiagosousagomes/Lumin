const express = require("express")
const userController = require("../controllers/userController")

const router = express.Router();

// Rota para criar um usuário (POST /users)
router.post('/', userController.CreateUser);

// Rota para listar todos os usuários (GET /users)
router.get('/', userController.getAllUser);

// Rota para listar um usuário específico (GET /users/:id)
router.get('/:id', userController.getOneUser);

// Rota para atualizar um usuário (PUT /users/:id)
router.put('/:id', userController.updateUser);

// Rota para deletar um usuário (DELETE /users/:id)
router.delete('/:id', userController.deleteUser);

module.exports = router; // Usando CommonJS