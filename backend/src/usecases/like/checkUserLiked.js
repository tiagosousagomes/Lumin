const likeRepository = require("../../repositories/likeRepository");

const checkUserLiked = async ({ postID, userID }) => {
    const post = await likeRepository.findPostById(postID);
    if (!post) return null;

    return post.likes.includes(userID);
};

module.exports = checkUserLiked;