const express = require("express")
const messageController = require("../controllers/messageController")
const router = express.Router();


// Rota para enviar uma mensagem
router.post('/', messageController.sendMessage);

// Rota para obter mensagens entre dois usuários
router.get('/:user1/:user2', messageController.getMessages);

// Rota para deletar messagem

router.delete('/:id', messageController.deleteMessage)

module.exports = router
