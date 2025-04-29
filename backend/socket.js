const { Server } = require('socket.io');
const logger = require('./src/utils/utils');
const Message = require('./src/models/message/messageSchema');
const crypto = require('crypto');
require('dotenv').config();

let io;
const users = {};
const userRooms = {};

// SISTEMA PARA CRIPTOGRAFIA DE MENSAGENS
const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = "aes-256-cbc";

const encryptMessage = (message) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedMessage: encrypted, iv: iv.toString("hex") };
};

const generateRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `private_${sortedIds[0]}_${sortedIds[1]}`;
};

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.URL_FRONT,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true 
        },
        transports: ['websocket', 'polling']
    });

    io.on("connection", (socket) => {
        logger.info("[User] User connected:", socket.id);

        socket.on("add_user", (userId) => {
            users[userId] = socket.id;
            userRooms[userId] = [];
            io.emit("get_users", Object.keys(users));
        });

        socket.on("join_private_chat", (data) => {
            const { userId, receiverId } = data;
            const roomId = generateRoomId(userId, receiverId);
            
            socket.join(roomId);
            
            if (!userRooms[userId]) userRooms[userId] = [];
            if (!userRooms[userId].includes(roomId)) {
                userRooms[userId].push(roomId);
            }
            
            logger.info(`[Room] User ${userId} joined room ${roomId}`);
        });

        socket.on("send_message", async (data) => {
            try {
                const roomId = generateRoomId(data.senderId, data.receiverId);
                
                const { encryptedMessage, iv } = encryptMessage(data.text);
                
                const message = new Message({
                    sender: data.senderId,
                    receiver: data.receiverId,
                    content: encryptedMessage,
                    iv: iv,
                    read: false
                });
                
                const savedMessage = await message.save();
                
                io.to(roomId).emit("receive_message", {
                    id: savedMessage._id,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    text: data.text,
                    time: savedMessage.createdAt
                });
                
                logger.info(`[Message] Message saved to MongoDB with ID: ${savedMessage._id}`);
            } catch (error) {
                logger.error(`[Error] Failed to save message: ${error.message}`);
                socket.emit("message_error", {
                    error: "Falha ao enviar mensagem. Tente novamente."
                });
            }
        });

        socket.on("mark_as_read", async (messageId) => {
            try {
                const message = await Message.findById(messageId);
                if (message) {
                    message.read = true;
                    await message.save();
                    
                    const roomId = generateRoomId(message.sender.toString(), message.receiver.toString());
                    io.to(roomId).emit("message_read", messageId);
                }
            } catch (error) {
                logger.error(`[Error] Failed to mark message as read: ${error.message}`);
            }
        });

        socket.on("leave_private_chat", (data) => {
            const { userId, receiverId } = data;
            const roomId = generateRoomId(userId, receiverId);
            
            socket.leave(roomId);
            
            if (userRooms[userId]) {
                userRooms[userId] = userRooms[userId].filter(room => room !== roomId);
            }
            
            logger.info(`[Room] User ${userId} left room ${roomId}`);
        });

        socket.on("disconnect", () => {
            logger.info("[User] User disconnected:", socket.id);
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            if (userId) {
                if (userRooms[userId]) {
                    userRooms[userId].forEach(roomId => {
                        socket.leave(roomId);
                    });
                    delete userRooms[userId];
                }
                
                delete users[userId];
                io.emit("get_users", Object.keys(users));
            }
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIO };