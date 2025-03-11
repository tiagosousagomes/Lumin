const express = require("express")
const followController = require("../controllers/followerController")
const router = express.Router();

router.post('/', followController.followUser);

router.delete('/',followController.unfollowUser)

router.get('/followers/:userID', followController.getFollowers);

router.get('/following/:userID', followController.getFollowing); 

module.exports = router; 