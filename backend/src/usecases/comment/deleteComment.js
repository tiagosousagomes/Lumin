const mongoose = require("mongoose");
const commentRepository = require("../../repositories/commentRepository");

const deleteComment = async (commentID, userID = null) => {
    if (!commentID) {
        throw new Error("ID do comentário não fornecido");
    }

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
        throw new Error("ID do comentário inválido");
    }

    const comment = await commentRepository.findCommentById(commentID);
    if (!comment) {
        throw new Error("Comentário não encontrado");
    }

    if (userID && comment.author.toString() !== userID) {
        throw new Error("Você não tem permissão para deletar este comentário");
    }

    return await commentRepository.deleteComment(commentID);
};

module.exports = deleteComment;