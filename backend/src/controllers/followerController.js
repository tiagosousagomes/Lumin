const createFollow = require("../usecases/follow/createFollow");
const deleteFollow = require("../usecases/follow/deleteFollow");
const findFollowing = require("../usecases/follow/findFollowing");
const findFollowers = require("../usecases/follow/findFollowers");
const logger = require("../utils/utils");

const followUser = async (req, res) => {
  try {
    const { followerID, followingID } = req.body;
    
    logger.info("[BACKEND] Follow request:", { followerID, followingID });
    
    await createFollow(followerID, followingID);
    res.status(200).json({
      success: true,
      message: "Usuário seguido com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro ao seguir usuário",
      error: err.message
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { followerID, followingID } = req.body;

    await deleteFollow(followerID, followingID);

    res.status(200).json({
      success: true,
      message: "Você deixou de seguir este usuário",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro ao deixar de seguir usuário",
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userID } = req.params;

    const followers = await findFollowers(userID);

    res.status(200).json({
      success: true,
      message: "Seguidores encontrados",
      followers: followers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar seguidores",
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userID } = req.params;

    const following = await findFollowing(userID);

    res.status(200).json({
      success: true,
      message: "Lista de usuários seguidos recuperada com sucesso",
      following: following,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar lista de usuários",
    });
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };
