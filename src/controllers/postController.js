const Post = require("../models/post");
const User = require("../models/user")

const createPost = async (req, res) => {
    try {
      const { content, author } = req.body;
  
      // Verifica se o autor existe
      const user = await User.findById(author);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Autor não encontrado",
        });
      }
  
      // Cria o post
      const post = new Post({
        content,
        author,
      });
  
      // Salva o post no banco de dados
      await post.save();
  
      res.status(201).json({
        success: true,
        message: "Post criado com sucesso",
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Erro ao criar o post",
        error: err.message,
      });
    }
  };

const getAllPosts = async (req, res, next) => {
    // Implementação para listar todos os posts

    try{
      const posts = await Post.find();
      res.status(201).json({
        success:true,
        message:'Lista de Post:',
        data:posts
      })
    }catch(err){
      next(err)
    }
};

const getAllPostFromUser = async (req, res, next) => {
    //Implementação para obter todos os posts de um user

    try{
      const userID = req.params.id

      const user = await User.findById(userID)

      if (!user){
        res.status(404).json({
          success:false,
          message:'usuario não encontrado'
        })
      }
      const posts = await Post.find({author:userID}).populate('author','name, username profilePicture')
      res.status(201).json({
        success:true,
        message: 'posts do usuario:',
        data:posts
      })
    }catch(err){
      next(err)
    }
};

const getPostById = async (req, res) => {
    // Implementação para obter um post por ID

    try{
      const postID = req.params.id
      
      const posts =  await Post.findById(postID)
      if(!posts){
        res.status(400).json({
          success:false,
          message:'post não encontrado!'
        })
      }
      res.status(200).json({
        success:false,
        message:'Post do ID:',
        data:posts
      })
    }catch{

    }
};

const updatePost = async (req, res,next) => {
    // Implementação para atualizar um post
  try{

    const {content} = req.body
    
    const posts = await Post.findByIdAndUpdate(req.params.id,{content}, { new: true, runValidators: true })
    if(!posts){
      res.status(400),json({
        success:false,
        message:'Post não encontrado!'
      })}
      res.status(200).json({
        success:true,
        message:'post atualizado com sucesso',
        data:posts
      })

  }catch(err){
    next(err)
  
  }}

    ;

const deletePost = async (req, res) => {
    // Implementação para deletar um post
  try{
    const posts = await Post.findByIdAndDelete(req.params.id)
    if (!posts){
      res.status(400).json({
        success:false,
        message: 'Post não encontrado',
      })
      res.status(200).json({
        sucess:false,
        message:'Post deletado com sucesso!'
      });
    }
  }catch(err){
    next(err)
  }
};

module.exports = {createPost,getAllPosts,getAllPostFromUser,updatePost,deletePost}