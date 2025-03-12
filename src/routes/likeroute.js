const express = require("express")
const likeController = require("../controllers/likeController")
const router = express.Router();



// Rota para Listar likes de um post

router.get('/post/:postID', likeController.getLikesByPost)

// Rota para dar like

router.post('/', likeController.likePost);

// Rota para dar deslike

router.delete('/post/',likeController.unlikePost)

module.exports = router; 