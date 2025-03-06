const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userController = require('../src/controllers/userController');

const JWT_SECRET = 'your-secret-key'; // Defina sua chave secreta aqui
const JWT_EXPIRATION = '1h';

const resolvers = {
  Query: {
    // Resolver para pegar o usuário autenticado
    me: async (_, __, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      return user;
    },
  },
  
  Mutation: {
    // Resolver para registrar um novo usuário
    register: async (_, { name, email, password, username, bio, profilePicture }) => {
      // Chama o controller de createUser para criar o usuário
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        username,
        bio,
        profilePicture,
      });
      await newUser.save();
      
      return newUser;
    },

    // Resolver para login de usuário
    login: async (_, { email, password }) => {
      // Verificar se o email existe no banco
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email ou senha incorretos.');
      }

      // Verificar se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Email ou senha incorretos.');
      }

      // Gerar o token JWT
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

      // Retorna o token e o usuário
      return {
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
      };
    },
  },
};

module.exports = resolvers;
