let mongoose = require("mongoose")
let postSchema = require("./postSchema")

const Post = mongoose.model('post',postSchema)


module.exports = Post