const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    const {title, text, userId} = req.body;

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
}

exports.getAllPosts = async(req, res) => {
    try{
    const posts = await Post.find().populate('user', 'name email')
    res.status(200).json(posts);
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Erro de servirdor', error: error.message});
    }
}
}