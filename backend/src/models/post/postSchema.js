let mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "O conteúdo da publicação é obrigatório"],
        minlength: [1, "O conteúdo não pode estar vazio"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: [],
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
            default: [],
        },
    ],
},{
    timestamps:true
}
);

postSchema.methods.toggleLike = async function (userId) {
    const likeIndex = this.likes.indexOf(userId);

    if (likeIndex === -1) {
        this.likes.push(userId);
    } else {
        this.likes.splice(likeIndex, 1);
    }

    await this.save();
    return this;
};

module.exports = postSchema

//
