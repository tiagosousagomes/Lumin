const { findMessageById, deleteById } = require('../../repositories/messageRepository');

const deleteMessage = async ({ messageID, userID }) => {
    const message = await findMessageById(messageID);

    if (!message) {
        throw new Error('Mensagem não encontrada');
    }

    const senderMatch = message.sender.toString() === userID;
    const receiverMatch = message.receiver.toString() === userID;

    if (!senderMatch && !receiverMatch) {
        throw new Error('Você não tem permissão para deletar esta mensagem');
    }

    await deleteById(messageID);

    return { message: 'Mensagem deletada com sucesso' };
};

module.exports = deleteMessage;