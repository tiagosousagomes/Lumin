const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/post/", postController.getAllPosts);
router.get("/post/user/:id", postController.getAllPostFromUser);
router.get("/post/:id", postController.getPostById);
router.post("/post/", postController.createPost);
router.put("/post/:id", postController.updatePost);
router.delete("/post/:id", postController.deletePost);

module.exports = router;
