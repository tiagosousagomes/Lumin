const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();

router.get("/message/", messageController.getMessages);
router.patch("/message/", messageController.markMessageAsRead);
router.post("/message/", messageController.sendMessage);
router.delete("/message/:id", messageController.deleteMessage);

module.exports = router;
