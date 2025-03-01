const express = require("express")
const likeController = require("../controllers/likeController")
const router = express.Router();



// Rota para dar like
router.post('/', likeController.likePost);


// Rota para dar deslike
router.delete('/:id',likeController.unlikePost)

// Rota para Listar likes de um post

router.get('/post/post:id', likeController.getLikesByPost)

module.exports = router; 