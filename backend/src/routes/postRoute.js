const express = require("express");
const postController = require("../controllers/postController");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


router.get("/post/", postController.getAllPosts);
router.get("/post/user/:id", postController.getAllPostFromUser);
router.get("/post/:id", postController.getPostById);
router.post("/post/", upload.single("image"), postController.createPost);
router.put("/post/:id", postController.updatePost);
router.delete("/post/:id", postController.deletePost);


module.exports = router;
