const mongoose = require("mongoose");
const Follower = require("../models/followers");
const User = require("../models/user");

const followUser = async (req, res) => {
  try {
    const { followerID, followingID } = req.body;
    
    console.log("Follow request:", { followerID, followingID });
    
    // Skip validation if IDs are undefined
    if (!followerID || !followingID) {
      return res.status(400).json({
        success: false,
        message: "IDs de usuário não fornecidos",
        details: { followerID, followingID }
      });
    }
    
    // Validate MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(followerID) || !mongoose.Types.ObjectId.isValid(followingID)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuário inválido",
        details: { 
          followerIDValid: mongoose.Types.ObjectId.isValid(followerID),
          followingIDValid: mongoose.Types.ObjectId.isValid(followingID)
        }
      });
    }

    const follower = await User.findById(followerID);
    const following = await User.findById(followingID);

    if (!follower || !following) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
        details: {
          followerFound: !!follower,
          followingFound: !!following
        }
      });
    }

    // Rest of the function remains the same
    const existingFollow = await Follower.findOne({
      follower: followerID,
      following: followingID,
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Usuário já está seguindo",
      });
    }

    const follow = new Follower({
      follower: followerID,
      following: followingID,
    });

    await follow.save();

    res.status(201).json({
      success: true,
      message: "Usuário seguido com sucesso",
    });
  } catch (err) {
    console.error("Error in followUser:", err);
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

    const follow = await Follower.findOneAndDelete({
      follower: followerID,
      following: followingID,
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Você não segue este usuário",
      });
    }

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

    const followers = await Follower.find({ following: userID }).populate(
      "follower",
      "name username profilePicture"
    );

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

    const following = await Follower.find({ follower: userID }).populate(
      "following",
      "name username profilePicture"
    );

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
