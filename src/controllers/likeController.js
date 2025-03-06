const Like = require("../models/likes");
const User = require("../models/user");
const Post = require("../models/post")

const likePost = async (req, res) => {
    // Implementação para curtir um post
    try{

        //verifica se o post ou o usuario existe
        const {userID, postID} = req.body;

        const user = await User.findById(userID)
        const post = await Post.findById(postID)

        if(!user || !post){
            return res.status(404).json({
                success:false,
                message: "Usuario ou post não encontrado!"
            })
        }

       
        //verifica se ja curtiu o post
        const existingLike = await Like.findOne({ user: userID, post: postID });
        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: "Você já curtiu esse post."
            });
        }

        // Cria um novo like
        const like = new Like({ user: userID, post: postID });
        await like.save();

        res.status(201).json({
            success:true,
            message:"curtida adicionada",
            data:post
        })

    }catch(err){
       res.status(500).json({
        success:false,
        message:'erro ao curtir o post',
        error:err.message

       })

    }
};

const unlikePost = async (req, res) => {
    // Implementação para remover uma curtida de um post
};

const getLikesByPost = async (req, res) => {
    // Implementação para listar curtidas de um post
};

module.exports = {likePost};