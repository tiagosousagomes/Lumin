const express = require("express")
const commentController = require("../controllers/commentController")
const router = express.Router();


// Rota para Listar comentarios de um post
router.get('/post/post:id',commentController.getCommentsByPost)


// Rota para criar comentario
router.post('/', commentController.createComment);


// Rota para deletar comentario
router.delete('/:id',commentController.deleteComment)

module.exports = router; 