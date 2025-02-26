import Like from "../models/like";

const likePost = async (req, res) => {
    // Implementação para curtir um post
};

const unlikePost = async (req, res) => {
    // Implementação para remover uma curtida de um post
};

const getLikesByPost = async (req, res) => {
    // Implementação para listar curtidas de um post
};

export default { likePost, unlikePost, getLikesByPost };