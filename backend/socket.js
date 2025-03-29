const { Server } = require('socket.io');

let io;
const users = {};

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("Usuário conectado: ", socket.id);

        socket.on("addUser", (userId) => {
            users[socket.id] = socket.Id;
            io.emit("getUsers", users);
        });

        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getMessage", {
                    senderId,
                    text,
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado: ", socket.id);

            for(let userId in users) {
                if(users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
            io.emit("getUsers", users);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io não inicializado!");
    }

    return io;
}

module.exports = { initializeSocket, getIO };

