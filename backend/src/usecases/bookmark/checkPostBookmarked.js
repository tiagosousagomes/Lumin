const mongoose = require("mongoose");
const bookmarkRepository = require("../../repositories/bookmarkRepository");

const checkPostBookmarked = async (userID, postID) => {
    if (!userID || !postID) {
        throw new Error("ID do usuário e do post são obrigatórios");
    }

    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(postID)) {
        throw new Error("ID inválido");
    }

    const bookmark = await bookmarkRepository.findBookmark(userID, postID);

    return {
        isBookmarked: !!bookmark
    };
};

module.exports = checkPostBookmarked;