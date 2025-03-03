const express = require("express")
const postController = require("../controllers/postController")
const router = express.Router();


// rota para listar todos os post
router.get('/',postController.getAllPosts)

// Rota para listar post por usuario
router.get('/:id', postController.getAllPostFromUser)

// Rota para criar Post
router.post('/', postController.createPost);

// Rota para atualizar usuário 
router.put('/:id',postController.updatePost)

// Rota para deletar usuario
 router.delete('/:id',postController.deletePost)

module.exports = router; 