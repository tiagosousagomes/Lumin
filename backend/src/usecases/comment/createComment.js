const mongoose = require("mongoose");
const User = require("../../models/user/userModel");
const Post = require("../../models/post/postModel");
const commentRepository = require("../../repositories/commentRepository");

const createComment = async (userID, postID, content) => {
    if (!userID || !postID || !content) {
        throw new Error('Dados obrigatórios não fornecidos');
    }

    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(postID)) {
        throw new Error('IDs inválidos');
    }

    if (typeof content !== 'string' || content.trim() === '') {
        throw new Error('Conteúdo do comentário é obrigatório');
    }

    if (content.length > 500) {
        throw new Error('Conteúdo do comentário deve ter no máximo 500 caracteres');
    }

    const user = await User.findById(userID);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const post = await Post.findById(postID);
    if (!post) {
        throw new Error('Post não encontrado');
    }

    return await commentRepository.createComment(userID, postID, content);
};

module.exports = createComment;