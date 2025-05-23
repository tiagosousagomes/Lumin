const toggleBookmarkUC = require("../usecases/bookmark/toogleBookmark");
const getBookmarksByUserUC = require("../usecases/bookmark/getBookmarksByUser");
const checkPostBookmarkedUC = require("../usecases/bookmark/checkPostBookmarked");
const countBookmarksByPostUC = require("../usecases/bookmark/countBookmarsByPost");

const toggleBookmark = async (req, res) => {
    try {
        const postID = req.params.postId;
        const userID = req.params.userId;

        const result = await toggleBookmarkUC(postID, userID);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao processar o bookmark",
            error: err.message,
        });
    }
};

const getBookmarksByUser = async (req, res) => {
    try {
        const userID = req.params.userId;

        const result = await getBookmarksByUserUC(userID);

        res.status(200).json({
            success: true,
            message: "Bookmarks encontrados com sucesso",
            data: result.data,
            count: result.count
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar bookmarks",
            error: err.message,
        });
    }
};

const checkPostBookmarked = async (req, res) => {
    try {
        const postID = req.params.postId;
        const userID = req.params.userId;

        const bookmark = await checkPostBookmarkedUC(postID, userID);
        
        res.status(200).json({
            success: true,
            isBookmarked: !!bookmark
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao verificar bookmark",
            error: err.message,
        });
    }
};

const countBookmarksByPost = async (req, res) => {
    try {
        const postID = req.params.postId;


        const result = await countBookmarksByPostUC(postID);

        res.status(200).json({
            success: true,
            count: result.count
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao contar bookmarks",
            error: err.message,
        });
    }
};

module.exports = {
    toggleBookmark,
    getBookmarksByUser,
    checkPostBookmarked,
    countBookmarksByPost
};