const Follower = require("../models/follow/followModel");

const followRepository = {
    findFollow: async (followerID, followingID) => {
        return await Follower.findOne({ follower: followerID, following: followingID });
    },

    createFollow: async (followerID, followingID) => {
        const follow = new Follower({ follower: followerID, following: followingID });
        return await follow.save();
    },

    deleteFollow: async (followerID, followingID) => {
        return await Follower.findOneAndDelete({ follower: followerID, following: followingID });
    },

    findFollowers: async (userID) => {
        return await Follower.find({ following: userID }).populate("follower", "name username profilePicture");
    },

    findFollowing: async (userID) => {
        return await Follower.find({ follower: userID }).populate("following", "name username profilePicture");
    }
};

module.exports = followRepository;
