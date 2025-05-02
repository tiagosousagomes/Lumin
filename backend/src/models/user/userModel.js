let mongoose = require('mongoose')
let userSchema = require('./userSchema') 

const User = mongoose.model('user',userSchema)

module.exports = User