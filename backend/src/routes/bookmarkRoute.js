const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const router = express.Router();

router.post("/post/:id/toggle", bookmarkController.toggleBookmark);

router.get("/user/:userId", bookmarkController.getBookmarksByUser);

router.get("/post/:postId/user/:userId/check", bookmarkController.checkPostBookmarked);

router.get("/post/:postId/count", bookmarkController.countBookmarksByPost);

module.exports = router;