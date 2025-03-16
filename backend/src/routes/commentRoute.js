const express = require("express");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.get("/comment/post/:postID", commentController.getCommentsByPost);
router.post("/comment/post", commentController.createComment);
router.delete("/comment/:commentID", commentController.deleteComment);

module.exports = router;
