const express = require("express")
const messageController = require("../controllers/messageController")
const router = express.Router();




// Rota para obter mensagens entre dois usuários
router.get('/', messageController.getMessages);


// Rota para marcar as mensagens como lidas (re-see)
router.get('/', messageController.markMessageAsRead)

// Rota para enviar uma mensagem
router.post('/', messageController.sendMessage);

// Rota para deletar messagem

router.delete('/:id', messageController.deleteMessage)

module.exports = router
