const followRepository = require("../../repositories/followRepository");
const mongoose = require("mongoose");
const User = require("../../models/user/userModel");

const createFollow = async (followerID, followingID) => {
    if (!followerID || !followingID) {
        throw new Error("ID de usuarios não fornecidos");
    }

    if (!mongoose.Types.ObjectId.isValid(followerID) || !mongoose.Types.ObjectId.isValid(followingID)) {
        throw new Error("IDs de usuarios inválidos");
    }

    const follower = await User.findById(followerID);
    const following = await User.findById(followingID);

    if (!follower || !following) {
        throw new Error("Um dos usuários não foi encontrado");
    }

    const existingFollow = await followRepository.findFollow(followerID, followingID);
    if (existingFollow) {
        throw new Error("Você já está seguindo este usuário");
    }

    return await followRepository.createFollow(followerID, followingID);
};

module.exports = createFollow;
