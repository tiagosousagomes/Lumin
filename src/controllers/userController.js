const User = require("../models/user");

const createUser = async (req, res, next) => {
  try {
    // verifica se ja existe o email

    const { name, password, username, bio, profilePicture, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "email já em uso",
      });
    }

    // Criar usuario

    const user = new User({
      name,
      password,
      username,
      bio,
      profilePicture,
      email,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "usuario criado com sucesso",
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
    res.status(201).json({
      success: true,
      message: "lista de usuarios:",
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
    const users = await User.findOne(userID);

    if (!users) {
      res.status(400).json({
        success: false,
        message: "usuario não encontrado",
      });
      res.status(200).json({
        sucess: false,
        message: "usuario correspondente ao ID:",
        data: users,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Atualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { name, password, username, bio, profilePicture, email } = req.body;
    const users = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password, username, bio, profilePicture },
      { new: true, runValidators: true }
    );
    if (!users) {
     return res.status(400).json({
        success: false,
        message: "usuario não encontrado",
      });
    }
    res.status(200).json({
      success: true,
      message: "usuario atualizado com sucesso!",
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
        message: "usuario não encontrado!",
      });
    }

    res.status(200).json({
      success: true,
      message: "usuario excluido com sucesso!",
    });
  } catch (err) {
    next(err);
  }
};

// Exportando as funções
module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
