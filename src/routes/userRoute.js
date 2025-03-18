const express = require("express");
const userController = require("../controllers/userController");
const { userAuthenticator, refreshTokenHandler, logoutUser } = require("../middlewares/middleAuthorization");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", userAuthenticator);
router.post("/refresh-token", refreshTokenHandler); // Nova rota para renovar token
router.post("/logout", logoutUser); // Nova rota para logout

router.get("/user/", authMiddleware, userController.getAllUser);
router.get("/user/:id", authMiddleware, userController.getUserById);
router.post("/user/", userController.createUser);
router.put("/user/:id", authMiddleware, userController.updateUser);
router.delete("/user/:id", authMiddleware, userController.deleteUser);

module.exports = router;
