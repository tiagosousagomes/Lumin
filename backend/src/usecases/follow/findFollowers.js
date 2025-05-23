const mongoose = require("mongoose");
const User = require("../../models/user/userModel");
const followRepository = require("../../repositories/followRepository");

const findFollow = async (userID) => {
    if (!userID) {
        throw new Error('ID de usuario não fornecido');
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error('ID de usuario inválido');
    }

    const user = await followRepository.findById(userID);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const followers = await followRepository.findFollowers(userID);

    return followers;
};

module.exports = findFollow;