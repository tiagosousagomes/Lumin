let mongoose = require('mongoose')
let commentSchema = require('./commentSchema')

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment