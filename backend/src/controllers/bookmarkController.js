const Post = require("../models/post/postModel");
const User = require("../models/user/userModel");
const Bookmark = require("../models/bookmark/bookmarkModel");

const toggleBookmark = async (req, res) => {
    try {
        const postID = req.params.id;
        const userID = req.body.userId;

        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "O ID do usuário é obrigatório",
            });
        }

        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado",
            });
        }

        // Verificar se o bookmark já existe
        const existingBookmark = await Bookmark.findOne({ user: userID, post: postID });

        if (!existingBookmark) {
            // Criar um novo bookmark se não existir
            const newBookmark = new Bookmark({
                user: userID,
                post: postID,
            });
            await newBookmark.save();
            
            return res.status(200).json({
                success: true,
                message: "Post salvo com sucesso",
                action: "bookmarked"
            });
        } else {
            // Remover o bookmark se já existir
            await Bookmark.findByIdAndDelete(existingBookmark._id);
            
            return res.status(200).json({
                success: true,
                message: "Post removido dos salvos com sucesso",
                action: "unbookmarked"
            });
        }
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

        const bookmarks = await Bookmark.find({ user: userID })
            .populate({
                path: 'post',
                populate: {
                    path: 'author',
                    select: 'name username profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Bookmarks encontrados com sucesso",
            data: bookmarks.map(bookmark => bookmark.post),
            count: bookmarks.length
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

        const bookmark = await Bookmark.findOne({ user: userID, post: postID });
        
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

        const count = await Bookmark.countDocuments({ post: postID });

        res.status(200).json({
            success: true,
            count
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