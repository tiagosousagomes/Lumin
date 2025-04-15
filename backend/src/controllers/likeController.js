const Post = require("../models/post");
const User = require("../models/user");

const likePost = async (req, res) => {
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

        if (post.likes.includes(userID)) {
            return res.status(400).json({
                success: false,
                message: "Você já curtiu este post",
                likes: post.likes,
            });
        }

        post.likes.push(userID);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post curtido com sucesso",
            likes: post.likes,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao curtir o post",
            error: err.message,
        });
    }
};
 
const unlikePost = async (req, res) => {
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

        const index = post.likes.indexOf(userID);
        if (index === -1) {
            return res.status(400).json({
                success: false,
                message: "Você não curtiu este post",
                likes: post.likes,
            });
        }

        post.likes.splice(index, 1);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post descurtido com sucesso",
            likes: post.likes,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao remover curtida",
            error: err.message,
        });
    }
};

const toggleLike = async (req, res) => {
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

        const index = post.likes.indexOf(userID);
        if (index === -1) {
            post.likes.push(userID);
            await post.save();
            
            return res.status(200).json({
                success: true,
                message: "Post curtido com sucesso",
                likes: post.likes,
                action: "liked"
            });
        } else {
            post.likes.splice(index, 1);
            await post.save();
            
            return res.status(200).json({
                success: true,
                message: "Post descurtido com sucesso",
                likes: post.likes,
                action: "unliked"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao processar a curtida",
            error: err.message,
        });
    }
};

const getLikesByPost = async (req, res) => {
    try {
        const postID = req.params.id;

        const post = await Post.findById(postID).populate({
            path: 'likes',
            select: 'name username profilePicture',
            model: User
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Curtidas encontradas com sucesso.",
            data: post.likes || [],
            count: post.likes ? post.likes.length : 0
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar curtidas",
            error: err.message,
        });
    }
};

const checkUserLiked = async (req, res) => {
    try {
        const postID = req.params.postId;
        const userID = req.params.userId;

        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado",
            });
        }

        const hasLiked = post.likes.includes(userID);

        res.status(200).json({
            success: true,
            hasLiked
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao verificar curtida",
            error: err.message,
        });
    }
};

module.exports = {
    likePost,
    unlikePost,
    toggleLike,
    getLikesByPost,
    checkUserLiked
};