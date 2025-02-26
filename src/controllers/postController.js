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