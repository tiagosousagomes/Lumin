let mongoose = require('mongoose')
let messageSchema = require('./messageSchema')

const Message = mongoose.model('message',messageSchema)

module.exports = Message