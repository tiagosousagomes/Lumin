const Post = require("../../models/post/postModel");
const User = require("../../models/user/userModel");

const getLikeByPost = async (postID) => {
    const post = await Post.findById(postID).populate({
        path: "likes",
        select: "name username profilePicture",
        model: User,
    });

    if (!post) return null

    return {
        likes: post.likes || [],
        count: post.likes ? post.likes.length : 0,
    };
};

module.exports = getLikeByPost;