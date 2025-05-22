const { findBetweenUsers } = require("../../repositories/messageRepository");
const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = "aes-256-cbc";

const decryptMessage = (encryptedContent, iv) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedContent, "hex", "utf8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const getMessagesBetweenUsers = async ({ userID1, userID2 }) => {
  const messages = await findBetweenUsers(userID1, userID2);

  return messages.map((message) => {
    const decryptedContent = decryptMessage(message.content, message.iv);
    return {
      id: message._id,
      senderId: message.sender,
      receiverId: message.receiver,
      text: decryptedContent,
      read: message.read,
      time: message.createdAt,
    };
  });
};

module.exports = getMessagesBetweenUsers;
