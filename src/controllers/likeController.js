const LikeController = require("../models/likes");
const UserController = require("../models/user");
const PostController = require("../models/post")

const likePost = async (req, res, next) => {
    // Implementação para curtir um post
    try{

        //verifica se o post ou o usuario existe
        const {userID, postID} = req.body;

        const user = UserController.findById(userID)
        const post = PostController.findById(postID)

        if(!user || !post){
            res.status(404).json({
                success:false,
                message: "Usuario ou post não encontrado!"
            })
        }

        //verifica se ja curtiu o post
        if(post.likes.includes(userID)){
           return res.status(400).json({
            success:false,
            message:"você ja curtiu esse post"
           })
        }

        //adiciona uma curtida ao post

        post.likes.push(userID)
        await post.save();

        res.status(201).json({
            success:true,
            message:"curtida adicionada",
            data:post
        })

    }catch(err){
        next(err)
    }
};

const unlikePost = async (req, res) => {
    // Implementação para remover uma curtida de um post
};

const getLikesByPost = async (req, res) => {
    // Implementação para listar curtidas de um post
};

module.exports = {likePost};