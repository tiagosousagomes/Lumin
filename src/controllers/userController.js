const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const JWT_EXPIRATION = "1h";

const createUser = async (req, res, next) => {
  try {
    // verifica se ja existe o email

    const { name, password, username, bio, profilePicture, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email já em uso",
      });
    }

    // Criar usuario
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      password: hashedPassword,
      username,
      bio,
      profilePicture,
      email,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Usuario criado com sucesso",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

//listar todos os usuarios

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Lista de usuarios:",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

//  listar apenas um usuario

const getUserById = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const users = await User.findById(userID);

    console.log(users)
    if (!users) {
      res.status(404).json({
        success: false,
        message: "Usuario não encontrado",
      });
     
    }
    res.status(200).json({
      sucess: true,
      message: "Usuario correspondente ao ID:",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Atualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { name, username, bio, profilePicture, email } = req.body;
    const users = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, username, bio, profilePicture },
      { new: true, runValidators: true }
    );
    if (!users) {
     return res.status(400).json({
        success: false,
        message: "Usuario não encontrado",
      });
    }
    res.status(200).json({
      success: true,
      message: "Usuario atualizado com sucesso!",
      data: users
    });
  } catch(err) {
    next(err)
  }
};

// deletar usuario
const deleteUser = async (req, res, next) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    if (!users) {
      res.stauts(400).json({
        success: false,
        message: "Usuario não encontrado!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario excluido com sucesso!",
    });
  } catch (err) {
    next(err);
  }
};

const userAutenticator = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email})

    if(!user) {
      return res.status(401).json({
        sucess: false,
        message: "Email ou senha incorretos.",
      });
    } 
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
      return res.status(401).json({
        sucess: false,
        message: "Email ou senha incorretos.",
    });
  }
      const token = jwt.sign({userId: user._id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      res.status(200).json({
        sucess: true,
        message: "Autenticação bem-sucedida",
        token: token,
        user: {
          _id: user._id,
          name: user.name, 
          email: user.email,
          username: user.username,
        },
      });
   }catch (err){
    next(err)
  } 
};
 

// Exportando as funções
module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  userAutenticator,
};
