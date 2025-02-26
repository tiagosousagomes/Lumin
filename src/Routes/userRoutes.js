const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUser());
router.post("/", userController.createUser());
router.get("/:id", userController.getOneUser());
router.put("/:id", userController.updateUser());
router.delete("/:id", userController.deleteUser());

