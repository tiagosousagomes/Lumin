const express = require("express")
const postController = require("../controllers/postController")
const router = express.Router();


// Rota para Listar Post
router.get('/',postController.getPost)

// Rota para listar post pelo ID
router.get('/:id', postController.getPostById)

// Rota para criar Post
router.post('/', postController.createPost);

// Rota para atualizar usuário 
router.put('/:id',postController.updatePost)

// Rota para deletar usuario
router.delete('/:id',postController.deletePost)

module.exports = router; 