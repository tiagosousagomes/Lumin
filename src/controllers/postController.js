<<<<<<< Updated upstream
const Post = require('../models/post');
const User = require('../models/user');

    exports.createPost = async (req, res) => {
        const {title, text, userId} = req.body;
=======
const Post = require("../models/post");
const User = require("../models/post")

const createPost = async (req, res) => {
    try{
        const {content, author} = req.body;

        const user = await User.findById(author);
        if(!user) {
            return res.status(404).json({
                sucess: false,
                message: "Autor não encontrado"
            })
        }

        const post = new Post({
            content,
            author,
        })

        await post.save();

        res.status(201).json({
            sucess: true,
            message: "Post criado com sucesso",
            data: post
        })
    } catch(err) {
        res.status(500).json({
            sucess: false,
            message: "Erro ao criar o post",
            error: err.message
        })
    }
};
>>>>>>> Stashed changes

            try { 
        const user = await User.findById(userId);
            if (!user){
            return res.status(400).json({ error: 'Usuário não encontrado!'})
        }

        const post = new Post({ title, text, user: userId });
        await post.save();

        user.posts.push(post._id);

        res.status(201).json(post);
    } catch(error){
        console.error(error);

        if(error.name === 'Erro de validção') {
            return res.status(400).json({ message: 'Input inválido', error: error.message});
        }
        res.status(500).json({message: 'Erro de servirdor', error: error.message});
    };


    exports.getAllPosts = async(req, res) => {
        try{
            const posts = await Post.find().populate('user', 'name email')
            res.status(200).json(posts);
        } catch (error){
            console.error(error);
            res.status(500).json({message: 'Erro de servirdor', error: error.message});
        }
    };

    exports.deletePost = async(req,res) => {
        try{ 
    
        } catch(error){

        }
    };
};