const express = require("express");
const bookmarkController = require("../controllers/bookmarkController");
const router = express.Router();

router.post("/bookmark/:id/toggle", bookmarkController.toggleBookmark);

router.get("/bookmark/:userId", bookmarkController.getBookmarksByUser);

router.get("/bookmark/:postId/user/:userId/check", bookmarkController.checkPostBookmarked);

router.get("/bookmark/:postId/count", bookmarkController.countBookmarksByPost);

module.exports = router;