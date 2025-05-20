let mongoose = require("mongoose");

let bookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, {
    timestamp: true
});

bookmarkSchema.index({user: 1, post: 1}, {unique: true})

module.exports = bookmarkSchema