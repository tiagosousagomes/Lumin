const sendMessageUseCase = require("../../useCases/message/sendMessage");
const markMessageAsReadUseCase = require("../../useCases/message/markMessageAsRead");
const getMessagesBetweenUsersUseCase = require("../../useCases/message/getMessagesBetweenUsers");
const getMessagesUseCase = require("../../useCases/message/getMessages");
const deleteMessageUseCase = require("../../useCases/message/deleteMessage");
const promptWithGeminiUseCase = require("../../useCases/message/promptWithGemini");

const sendMessage = async (req, res) => {
  try {
    const {
      senderID,
      receiverID,
      content
    } = req.body;

    const message = await sendMessageUseCase({
      senderID,
      receiverID,
      content
    });

    res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro interno",
      error: err.message
    });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const {
      messageID
    } = req.body;

    const updatedMessage = await markMessageAsReadUseCase({
      messageID
    });

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mensagem marcada como lida",
      data: updatedMessage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro interno",
      error: err.message
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const {
      userID1,
      userID2
    } = req.query;

    const messages = await getMessagesUseCase({
      userID1,
      userID2
    });

    res.status(200).json({
      success: true,
      message: "Mensagens recuperadas com sucesso",
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro interno",
      error: err.message
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const {
      messageID,
      userID
    } = req.body;

    const result = await deleteMessageUseCase({
      messageID,
      userID
    });

    if (!result.found) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada"
      });
    }

    if (!result.authorized) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para excluir essa mensagem"
      });
    }

    res.status(200).json({
      success: true,
      message: "Mensagem excluída com sucesso"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const {
      userId,
      receiverId
    } = req.params;

    const messages = await getMessagesBetweenUsersUseCase({
      userId,
      receiverId
    });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const promptWithGemini = async (req, res) => {
  const {
    question
  } = req.body;

  if (!question) {
    return res.status(400).json({
      success: false,
      message: "Pergunta não fornecida"
    });
  }

  try {
    const response = await promptWithGeminiUseCase({
      question
    });

    res.status(200).json({
      success: true,
      message: "Resposta da IA gerada com sucesso",
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao gerar resposta com a IA",
      error: error.message,
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