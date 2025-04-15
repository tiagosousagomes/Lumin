const User = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer")

const upload = multer ({
  store: Storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const uploadImages = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "headerImage", maxCount: 1 },
]);

const createUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email já em uso",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarFile = req.files?.avatar?.[0];
    const headerImageFile = req.files?.headerImage?.[0];

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      avatar: avatarFile
        ? {
            data: avatarFile.buffer,
            contentType: avatarFile.mimetype,
          }
        : undefined,
      headerImage: headerImageFile
        ? {
            data: headerImageFile.buffer,
            contentType: headerImageFile.mimetype,
          }
        : undefined,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

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

const getUserById = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const users = await User.findById(userID);
    
    if (!users) {
     return res.status(404).json({
        success: false,
        message: "Usuario não encontrado",
      });
    }
    res.status(200).json({
      success: true,
      message: "Usuario correspondente ao ID:",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, username, bio, email, location } = req.body;

    const avatarFile = req.files?.avatar?.[0];
    const headerImageFile = req.files?.headerImage?.[0];

    const updateData = {
      name,
      username,
      bio,
      email,
      location,
    };

    if (avatarFile) {
      updateData.avatar = {
        data: avatarFile.buffer,
        contentType: avatarFile.mimetype,
      };
    }

    if (headerImageFile) {
      updateData.headerImage = {
        data: headerImageFile.buffer,
        contentType: headerImageFile.mimetype,
      };
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    if (!users) {
      res.status(400).json({
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

module.exports = {
  createUser: [uploadImages, createUser],
  getAllUser,
  getUserById,
  updateUser: [uploadImages, updateUser],
  deleteUser,
};