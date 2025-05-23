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

    const user = await User.findById(userID);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const following = await followRepository.findFollowing(userID);

    return following;
};

module.exports = findFollow;
