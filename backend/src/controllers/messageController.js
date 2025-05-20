const Message = require("../models/message/messageModel");
const User = require("../models/user/userModel");
const crypto = require("crypto");
require("dotenv").config();
const aiService = require("../Services/aiService");

// SISTEMA PARA CRIPTOGRAFIA DE MENSAGENS
const SECRET_KEY = process.env.SECRET_KEY
const ALGORITHM = "aes-256-cbc";

const encryptMessage = (message) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedMessage: encrypted, iv: iv.toString("hex") };
};

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

const sendMessage = async (req, res) => {
  try {
    const { senderID, receiverID, content } = req.body;

    const sender = await User.findById(senderID);
    const receiver = await User.findById(receiverID);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const { encryptedMessage, iv } = encryptMessage(content);

    const message = new Message({
      sender: sender._id,
      receiver: receiver._id,
      content: encryptedMessage,
      iv: iv,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: message,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro interno", error: err.message });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const { messageID } = req.body;

    const message = await Message.findById(messageID);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada",
      });
    }

    message.read = true;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Mensagem marcada como lida",
      data: message,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro interno", error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userID1, userID2 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: userID1, receiver: userID2 },
        { sender: userID2, receiver: userID1 },
      ],
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map((message) => {
      const decryptedContent = decryptMessage(message.content, message.iv);
      return { ...message.toObject(), content: decryptedContent };
    });

    res.status(200).json({
      success: true,
      message: "Mensagens recuperadas com sucesso",
      data: decryptedMessages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro interno", error: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageID, userID } = req.body;

    const message = await Message.findById(messageID);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada",
      });
    }

    if (
      message.sender.toString() !== userID &&
      message.receiver.toString() !== userID
    ) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para excluir essa mensagem",
      });
    }

    await Message.deleteOne({ _id: messageID });

    res.status(200).json({
      success: true,
      message: "Mensagem excluída com sucesso",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro interno", error: err.message });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });
    
    const decryptedMessages = messages.map(message => {
      const decryptedContent = decryptMessage(message.content, message.iv);
      return {
        id: message._id,
        senderId: message.sender,
        receiverId: message.receiver,
        text: decryptedContent,
        read: message.read,
        time: message.createdAt
      };
    });
    
    return res.status(200).json({
      success: true,
      messages: decryptedMessages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

const promptWithGemini = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ success: false, message: "Pergunta não fornecida" });
  }
  
  try {
    const response = await aiService.prompt(question);
  
    res.status(200).json({
      success: true,
      message: "AI response generated",
      response,
    });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating response",
    });
  }
};

module.exports = {
  sendMessage,
  markMessageAsRead,
  getMessages,
  deleteMessage,
  getMessagesBetweenUsers,
  promptWithGemini,
};