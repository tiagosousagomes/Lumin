const likeRepository = require("../../repositories/likeRepository");

const toggleLike = async ({ postID, userID }) => {
    const post = await likeRepository.findPostById(postID);
    if (!post) return{
        success: false,
        message: "Post não encontrado"
    };

    const index = post.likes.indexOf(userID);
    let action;

    if (index === -1) {
        post.likes.push(userID);
        action = "like";
    } else {
        post.likes.splice(index, 1);
        action = "unlike";
    }

    await likeRepository.savePost(post);

    return {
        success: true,
        message: `Post ${action === "liked" ? "curtido" : "descurtido"} com sucesso`,
        data: post.likes,
        action,
    };
};

module.exports = toggleLike;