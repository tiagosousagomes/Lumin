const userRepository = require("../repositories/userRepository")
const multer = require("multer")

const createUserUC = require("../usecases/user/createUser");
const getAllUsersUC = require("../usecases/user/getAllUsers");
const getUserByIdUC = require("../usecases/user/getUserById");
const updateUserUC = require("../usecases/user/updateUser");
const deleteUserUC = require("../usecases/user/deleteUser");

const upload = multer ({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const uploadImages = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "headerImage", maxCount: 1 },
]);

const createUser = async (req, res, next) => {
  try{
    const { name, username, email, password } = req.body;
    const avatarFile = req.files?.avatar?.[0];
    const headerImageFile = req.files?.headerImage?.[0];

    const user = await createUserUC(
      { name, username, email, password, avatarFile, headerImageFile }, userRepository
    );

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: user,
    });
  }catch (err){
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUsersUC(userRepository);
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
    const user = await getUserByIdUC(req.params.id, userRepository);

    res.status(200).json({
      success: true,
      message: "Usuário correspondente ao ID:",
      data: user, 
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
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
      avatar: avatarFile ? { data: avatarFile.buffer, contentType: avatarFile.mimetype} : undefined,
      headerImage: headerImageFile ? { data: headerImageFile.buffer, contentType: headerImageFile.mimetype} : undefined,
    };
    const user = await updateUserUC(req.params.id, updateData, userRepository);

    res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso!",
      data: user,
    });
    } catch (err) {
      res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try { 
    await deleteUserUC(req.params.id, userRepository);

    res.status(200).json({
      success: true,
      message: "Usuário excluído com sucesso!"
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createUser: [uploadImages, createUser],
  getAllUser,
  getUserById,
  updateUser: [uploadImages, updateUser],
  deleteUser,
};