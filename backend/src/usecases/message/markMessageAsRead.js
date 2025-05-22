const { markAsRead } = require('../../repositories/messageRepository');

const markMessageAsRead = async ({ messageID }) => {
    const message = await markAsRead(messageID);

    if (!message) {
        throw new Error('Mensagem não encontrada');
    }

    return message;
};

module.exports = markMessageAsRead;