const express = require("express");
const followController = require("../controllers/followerController");
const router = express.Router();

router.post("/follow", followController.followUser);
router.delete("/follow", followController.unfollowUser);
router.get("/followers/:userID", followController.getFollowers);
router.get("/following/:userID", followController.getFollowing);

module.exports = router;
