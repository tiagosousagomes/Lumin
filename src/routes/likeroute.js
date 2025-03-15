const express = require("express");
const likeController = require("../controllers/likeController");
const router = express.Router();

router.get("/like/post/:postID", likeController.getLikesByPost);
router.post("/like/", likeController.likePost);
router.delete("/like/post/unlike", likeController.unlikePost);

module.exports = router;
