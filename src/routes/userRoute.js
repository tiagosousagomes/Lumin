const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router();



// Listar usuarios
router.get('/',userController.getUser)

// Listar usuario pelo ID
router.get('/:id', userController.getUserById)

// Rota para criar um usuário (POST /users)
router.post('/', userController.createUser);

// Rota para atualizar um usuário 
router.put('/:id',userController.updateUser)

// Rota para deletar um usuario
router.delete('/:id',userController.deleteUser)

module.exports = router; 