const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router();



// Rota para Listar todos os usuarios
router.get('/',userController.getAllUser)

// Rota para Listar usuario pelo ID
router.get('/:id', userController.getUserById)

// Rota para criar um usuário (POST /users)
router.post('/', userController.createUser);

// Rota para atualizar um usuário 
router.put('/:id',userController.updateUser)

// Rota para deletar um usuario
router.delete('/:id',userController.deleteUser)

module.exports = router; 