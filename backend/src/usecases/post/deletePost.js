const Post = require("../../models/post/postModel");

const deletePost = async (postId) => {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
        throw new Error("Post não encontrado");
    }

    return { message: "Post deletado com sucesso!" };
};

module.exports = deletePost;
