const followRepository = require('../../repositories/followRepository');
const mongoose = require('mongoose');

const findFollow = async (followerID, followingID) => {
    if (!followerID || !followingID) {
        throw new Error('ID de usuarios não fornecidos');
    }

    if (!mongoose.Types.ObjectId.isValid(followerID) || !mongoose.Types.ObjectId.isValid(followingID)) {
        throw new Error('IDs de usuarios inválidos');
    }

    const follow = await followRepository.findFollow(followerID, followingID);

    return follow;
};

module.exports = findFollow;