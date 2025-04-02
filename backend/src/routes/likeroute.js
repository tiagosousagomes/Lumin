const express = require("express");
const likeController = require("../controllers/likeController");
const router = express.Router();

router.get("/like/post/:postID", likeController.getLikesByPost);
router.post("/like/post/:id", likeController.likePost);
router.delete("/like/post/unlike", likeController.unlikePost);

module.exports = router;
