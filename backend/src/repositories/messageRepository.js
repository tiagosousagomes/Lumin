const Message = require('../models/message/messageModel');

const messageRepository = {

    create: async (messageData) => {
        const message = new Message(messageData);
        return await message.save();
    },

    findById: async (id) => {
        return await Message.findById(id)
            .populate("sender", "name username profilePicture")
            .populate("receiver", "name username profilePicture");
    },

    findBetweenUsers: async (userId1, userId2) => {
        return await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name username profilePicture")
            .populate("receiver", "name username profilePicture");
    },

    deleteById: async (id) => {
        return await Message.findByIdAndDelete(id);
    },

    markAsRead: async (messageId) => {
        const message = await Message.findById(messageId);

        if(!message){
            return null;
        }

        message.read = true;
        return await message.save();
    },
};

module.exports = messageRepository;