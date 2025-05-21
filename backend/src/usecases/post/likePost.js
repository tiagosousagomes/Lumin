const Post = require("../../models/post/postModel");

const likePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error("Post não encontrado");
    }

    const index = post.likes.indexOf(userId);
    if (index === -1) {
        post.likes.push(userId);
    } else {
        post.likes.splice(index, 1);
    }

    await post.save();

    return {
        liked: index === -1,
        likesCount: post.likes.length,
        likes: post.likes
    };
};

module.exports = likePost;
