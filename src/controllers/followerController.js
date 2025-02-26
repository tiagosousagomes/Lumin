import Follower from "../models/follower";

const followUser = async (req, res) => {
    // Implementação para seguir um usuário
};

const unfollowUser = async (req, res) => {
    // Implementação para deixar de seguir um usuário
};

const getFollowers = async (req, res) => {
    // Implementação para listar seguidores de um usuário
};

const getFollowing = async (req, res) => {
    // Implementação para listar quem um usuário está seguindo
};

export default { followUser, unfollowUser, getFollowers, getFollowing };