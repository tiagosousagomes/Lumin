let mongoose = require('mongoose')
let bookmarkSchema = require('./bookmarkSchema')

const Bookmark = mongoose.model('bookmark', bookmarkSchema)

module.exports = Bookmark