const mongoose = require("mongoose");
const Post = require("../../models/post/postModel");
const commentRepository = require("../../repositories/commentRepository");

const getCommentsByPost = async (postID) => {
    if (!postID) {
        throw new Error('ID do post não fornecido');
    }

    if (!mongoose.Types.ObjectId.isValid(postID)) {
        throw new Error('ID do post inválido');
    }

    const post = await Post.findById(postID);
    if (!post) {
        throw new Error('Post não encontrado');
    }

    return await commentRepository.findCommentsByPost(postID);
};

module.exports = getCommentsByPost;