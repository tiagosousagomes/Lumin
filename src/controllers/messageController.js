const Message = require("../models/message");

const sendMessage = async (req, res) => {
    // Implementação para enviar uma mensagem
};

const getMessages = async (req, res) => {
    // Implementação para listar mensagens entre dois usuários
};

const deleteMessage = async (req, res) => {
    // Implementação para deletar uma mensagem
};

module.exports = { sendMessage, getMessages, deleteMessage };