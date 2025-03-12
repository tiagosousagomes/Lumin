const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router();


router.get('/user/',userController.getAllUser)
router.get('/user/:id', userController.getUserById)
router.post('/user/', userController.createUser);
router.put('/user/:id',userController.updateUser)
router.delete('/user/:id',userController.deleteUser)

module.exports = router; 