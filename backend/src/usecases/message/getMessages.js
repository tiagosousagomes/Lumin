const Message = require("../../models/Message");
const decryptMessage = require("../../utils/decryptMessage");

const getMessages = async ({ userID1, userID2 }) => {
  const messages = await Message.find({
    $or: [
      { sender: userID1, receiver: userID2 },
      { sender: userID2, receiver: userID1 },
    ],
  }).sort({ createdAt: 1 });

  const decryptedMessages = messages.map((message) => {
    const decryptedContent = decryptMessage(message.content, message.iv);
    return {
      ...message.toObject(),
      content: decryptedContent,
    };
  });

  return decryptedMessages;
};

module.exports = getMessages;
