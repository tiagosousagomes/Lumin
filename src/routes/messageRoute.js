const express = require("express");
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/message/", authMiddleware, messageController.getMessages);
router.patch("/message/", authMiddleware, messageController.markMessageAsRead);
router.post("/message/", authMiddleware, messageController.sendMessage);
router.delete("/message/:id", authMiddleware, messageController.deleteMessage);

module.exports = router;
