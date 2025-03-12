const express = require("express");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.get("/comment/post/:Id", commentController.getCommentsByPost);
router.post("/comment/", commentController.createComment);
router.delete("/comment/:id", commentController.deleteComment);

module.exports = router;
