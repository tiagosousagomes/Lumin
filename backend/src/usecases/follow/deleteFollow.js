const followRepository = require('../../repositories/followRepository');

const deleteFollow = async (followerID, followingID) => {

    if (!followerID || !followingID) {
        throw new Error('ID de usuarios não fornecidos');
    }

    if (!mongoose.Types.ObjectId.isValid(followerID) || !mongoose.Types.ObjectId.isValid(followingID)) {
        throw new Error('IDs de usuarios inválidos');
    }

    const deletedFollow = await followRepository.deleteFollow(followerID, followingID);
    
    if (!deletedFollow) {
        throw new Error('Você não está seguindo este usuário');
    }
   
    return deletedFollow;
}

module.exports = deleteFollow;