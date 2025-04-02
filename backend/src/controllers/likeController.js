const Like = require("../models/likes");
const User = require("../models/user");
const Post = require("../models/post");

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

        const index = post.likes.indexOf(userID);
        if (index === -1) {
            post.likes.push(userID); 
        } else {
            post.likes.splice(index, 1); 
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: index === -1 ? "Post curtido com sucesso" : "Post descurtido com sucesso",
            likes: post.likes,
        });
    } catch (err) {
        console.error("Erro ao processar a curtida:", err);
        res.status(500).json({
            success: false,
            message: "Erro ao processar a curtida",
            error: err.message,
        });
    }
};

const unlikePost = async (req, res) => {
    try {
        const {
            userID,
            postID
        } = req.body;

        const like = await Like.findOneAndDelete({
            user: userID,
            post: postID
        });

        if (!like) {
            return res.status(400).json({
                success: false,
                message: "Curtida não encontrada",
            });
        }
        res.status(200).json({
            success: true,
            message: "curtida removida",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "erro ao curtir",
            error: err.message,
        });
    }
};

const getLikesByPost = async (req, res) => {
    try {
        const postID = req.params.postID;

        const likes = await Like.find({
            post: postID
        }).populate(
            "user",
            "name username profilePicture"
        );

        if (likes.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Este post não tem likes.",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Curtidas encontradas com sucesso.",
            data: likes,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "erro ao listar curtidas",
            error: err.message,
        });
    }
};

module.exports = {
    likePost,
    unlikePost,
    getLikesByPost
};