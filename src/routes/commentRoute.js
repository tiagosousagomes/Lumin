const express = require("express")
const commentController = require("../controllers/commentController")
const router = express.Router();

router.get('/comment/:Id', commentController.getCommentsByPost);

router.post('/', commentController.createComment);

router.delete('/:id',commentController.deleteComment)

module.exports = router; 