const Post = require("../models/like/likeModel");

const likeRepository = {
    findPostById: async (postID) => {
        return await Post.findById(postID);
    },

    savePost: async (post) => {
        return await post.save();
    },
}

module.exports = likeRepository;
