const Message = require("../models/message");
const User = require("../models/user");

const sendMessage = async (req, res) => {
    try{
        const { senderID, receiverID, content } = req.body;

        const sender = await User.findById(senderID)
        const receiver = await User.findById(receiverID)

        if(!sender || !receiver) {
            return res.status(404).json({
                sucess: false,
                message: "Usuário não encontrado",
            });
        }

        const message = new Message({
            sender: sender._id,
            receiver: receiver._id,
            content,
        });

        await message.save();

        res.status(201).json({
            sucess: true, 
            message: "Mensagem enviada com sucesso",
            data: message,
        });
    } catch (err){
        next(err);
    }
};

const markMessageAsRead = async (req, res, next) => {
    try{
        const { messageID }= req.body;


        const message = await Message.findById(messageID);

        if (!message) {
            return res.status(404).json({
                sucess: false, 
                message: "Mensagem não encontrada",
            })
        }

        message.read = true; 

        await message.save();

        res.status(200).json({
            sucess: true, 
            message: "Mensagem marcada como lida",
            data: message,
        })
    }catch (err){
        next(err);
    }
};

const getMessages = async (req, res) => {
    try{
        const { userID1, userID2 } = req.query;

        const messages = await Message.find({
            $or: [
                {sender: userID1, receiver: userID2 },
                {sender: userID2, receiver: userID1},
            ],
        }).sort({creatAt: 1});

        res.status(200).json({
            sucess:true,
            message: "Mensagens recuperadas com sucesso",
            data: messages,
        });
    }catch(err){
        next(err);
    }
};

const deleteMessage = async (req, res) => {
    try{
        const { messageID, userID } = req.body;
        
        const message = await Message.findById(messageID);

        if(!message){
            return res.status(404).json({
                sucess: false,
                message: "Mensagem não encontrada",
            });
        }

        if (message.sender.toString() !== userID && message.receiver.toString() !== userID){
            return res.status(403),json({
                sucess: false,
                message: "Você não tem permissão para excluir essa mensagem",
            });
        }
        
        await message.remove();

        res.status(200).json({
            sucess: true,
            message: "Mensagem excluída com sucesso",
        });
    }catch(err){
        next(err);
    }
};

module.exports = { 
    sendMessage, 
    markMessageAsRead,
    getMessages, 
    deleteMessage,
};