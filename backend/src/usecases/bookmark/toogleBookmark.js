const mongoose = require("mongoose");
const User = require("../../models/user/userModel");
const Post = require("../../models/post/postModel");
const bookmarkRepository = require("../../repositories/bookmarkRepository");

const toggleBookmark = async (userID, postID) => {
    if (!userID || !postID) {
        throw new Error('Dados obrigatórios não fornecidos');
    }

    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(postID)) {
        throw new Error('IDs inválidos');
    }

    const user = await User.findById(userID);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const post = await Post.findById(postID);
    if (!post) {
        throw new Error('Post não encontrado');
    }

    const existingBookmark = await bookmarkRepository.findBookmark(userID, postID);

    if (!existingBookmark) {
        await bookmarkRepository.createBookmark(userID, postID);
        return {
            action: "bookmarked",
            message: 'Post adicionado aos favoritos'
        };
    } else {
        await bookmarkRepository.deleteBookmark(userID, postID);
        return {
            action: "unbookmarked",
            message: 'Post removido dos favoritos'
        };
    }
};

module.exports = toggleBookmark;