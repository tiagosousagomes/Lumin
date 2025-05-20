let mongoose = require('mongoose')
let followSchema = require('./followSchema')

const Follow = mongoose.model("follow",followSchema)

module.exports = Follow