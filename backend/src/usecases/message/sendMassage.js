const User = require("../../models/user/userModel");
const { create } = require("../../repositories/messageRepository");
const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = "aes-256-cbc";

const encryptMessage = (message) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedMessage: encrypted, iv: iv.toString("hex") };
};

const sendMessage = async ({ senderID, receiverID, content }) => {
  const sender = await User.findById(senderID);
  const receiver = await User.findById(receiverID);

  if (!sender || !receiver) {
    throw new Error("Usuário não encontrado");
  }

  const { encryptedMessage, iv } = encryptMessage(content);

  const message = await create({
    sender: sender._id,
    receiver: receiver._id,
    content: encryptedMessage,
    iv,
  });

  return message;
};

module.exports = sendMessage;
