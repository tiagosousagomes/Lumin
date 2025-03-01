const express = require("express")
const followController = require("../controllers/followerController")
const router = express.Router();



// Rota para dar seguir
router.post('/', followController.followUser);


// Rota para dar deslike
router.delete('/:id',followController.unfollowUser)

// Rota para Listar likes de um post

router.get('/followers/:userId', followController.getFollowers); 
router.get('/following/:userId', followController.getFollowing); 

module.exports = router; 