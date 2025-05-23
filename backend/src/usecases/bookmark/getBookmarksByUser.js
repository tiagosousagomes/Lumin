const mongoose = require("mongoose");
const User = require("../../models/user/userModel");
const bookmarkRepository = require("../../repositories/bookmarkRepository");

const getBookmarksByUser = async (userID) => {
    if (!userID) {
        throw new Error('ID de usuario não fornecido');
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error('ID de usuario inválido');
    }

    const user = await User.findById(userID);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const bookmarks = await bookmarkRepository.getBookmarksByUser(userID);

    return {
        posts: bookmarks.map(bookmark => bookmark.post),
        count: bookmarks.length
    };
};

module.exports = getBookmarksByUser;