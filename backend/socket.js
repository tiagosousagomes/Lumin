const { Server } = require('socket.io');
const logger = require('./src/utils/utils');

let io;
const users = {};

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: `${process.env.URL_FRONT}`,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true 
        },
        transports: ['websocket', 'polling']
    });

    io.on("connection", (socket) => {
        logger.info("[User] User connected:", socket.id);

        socket.on("add_user", (userId) => {
            users[userId] = socket.id;
            io.emit("get_users", Object.keys(users));
        });

        socket.on("send_message", (data) => {
            const receiverSocketId = users[data.receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", {
                    id: data.id,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    text: data.text,
                    time: data.time
                });
            }
        });

        socket.on("disconnect", () => {
            logger.info("[User] User disconnected:", socket.id);
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            if (userId) {
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