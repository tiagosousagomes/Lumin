const express = require("express");
const likeController = require("../controllers/likeController");
const router = express.Router();

router.get("/like/:id/likes", likeController.getLikesByPost);
router.get("/like/:postId/user/:userId/liked", likeController.checkUserLiked);
router.post("/like/:id/toggle", likeController.toggleLike);

module.exports = router;