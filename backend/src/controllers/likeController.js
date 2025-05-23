const toggleLike = require("../usecases/like/toggleLike");
const getLikeByPost = require("../usecases/like/getLikeByPost");
const checkUserLiked = require("../usecases/like/checkUserLiked");

const toggleLike = async (req, res) => {
    try {
        const postID = req.params.postID;
        const userID = req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "ID do usuário é obrigatório"
            });
        }

        const result = await toggleLikeUseCase({
            postID,
            userID
        });

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getLikeByPost = async (req, res) => {
    try {
        const postID = req.params.postID;
        const result = await checkUserLikedUseCase({
            postID
        });

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Curtida encontrada",
            data: result.likes,
            count: result.count
        });
    }catch (err) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar curtidas',
        });
    }
}

const checkUserLiked = async (req, res) => {
    try {
        const { postID, userID } = req.params;
        const result = await checkUserLikedUseCase({
            postID,
            userID
        });

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "Post não encontrado"
            });
        }

        res.status(200).json({
            success: true,
            hasLiked: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erro ao verificar curtida",
            error: err.message
        });
    }
}

module.exports = {
    toggleLike,
    getLikeByPost,
    checkUserLiked
};