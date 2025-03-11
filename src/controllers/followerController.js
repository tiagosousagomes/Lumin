const Follower = require("../models/follower");
const User = require("../models/user");

const followUser = async (req, res) => {
    try{
        const { followerID, followingID } = req.body;

        const follower = await User.findById(followerID);
        const following = await User.findById(followingID);

        if (!follower || !following) {
            return res.status(404).json({ 
                succsess: false,
                message: "Usuário não encontrado" });
        }

        const existingFollow = await Follower.findOne({ 
            follower: followerID, 
            following: followingID 
        });

        if (existingFollow) {
            return res.status(400).json({ 
                succsess: false,
                message: "Usuário já está seguindo" });
        }

        const follow = new Follower({
            follower: followerID,
            following: followingID
        });

        await follow.save();

        res.status(201).json({ 
            succsess: true,
            message: "Usuário seguido com sucesso" });
    }catch(err){
        res.status(500).json({ 
            succsess: false,
            message: "Erro ao seguir usuário" });
    }
    
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

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };