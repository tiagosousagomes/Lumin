const mongoose = require('mongoose')

    const PostSchema = new mongoose.Schema({
        title: { type: String, require: true },
        text: { type: String, require: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    })

module.exports = mongoose.model("Post", PostSchema)