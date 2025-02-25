const User = require('../models/User');
const Post = require('../models/Post');

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
    
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, email e senha são requeridos.' });
        }

        const user = new User({ name, email, password });

        
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error(error);

        if (error.name === 'Erro de validação') {
            return res.status(400).json({ message: 'Input inválido', error: error.message });
        }

        res.status(500).json({ message: 'Erro de servirdor', error: error.message });
    }


    exports.getAllUsers = async (req, res) => {
        try {
            const users = await User.find().populate('posts', 'Titulo do texto');
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro de servirdor', error: error.message });
        }
    };

    exports.deletePost = async(req,res) => {
        try{ 
            if(!name){
                return res.status(400).json({ message: 'Usuário não indentificado.'})
            }
        } catch(error){
            
        }
    };
};
