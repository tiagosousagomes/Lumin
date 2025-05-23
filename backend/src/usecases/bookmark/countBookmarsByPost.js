const mongoose = require("mongoose");
const Post = require("../../models/post/postModel");
const bookmarkRepository = require("../../repositories/bookmarkRepository");

const countBookmarksByPost = async (postID) => {
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
    
    const count = await bookmarkRepository.countBookmarksByPost(postID);

    return { count};
};

module.exports = countBookmarksByPost;