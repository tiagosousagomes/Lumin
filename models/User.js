const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
    })

module.exports = mongoose.model('User', UserSchema)