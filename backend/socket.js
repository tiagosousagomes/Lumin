const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("Usuário conectado: ", socket.id);

        socket.on("message", (data) => {
            console.log(`Mensagem recebida ${data}`);
            io.emit("message", data);
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado: ", socket.id);
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

