let mongoose = require("mongoose");
const { use } = require("react");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "O conteúdo da publicação é obrigatório"],
        minlength: [1, "O conteúdo não pode estar vazio"],
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        avatar: {
            data: Buffer,
            contentType: String,
	},

    },
    likes: [
        {
            type: Number,
            default: 0,
        },
    ],
    comments: [
        {
            type: Number,
            default: 0,
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


