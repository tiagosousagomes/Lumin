let mongoose = require("mongoose")
let likeSchema = require("./likeSchema")

const Like = mongoose.model('like',likeSchema)

module.exports = Like