const Post = require("../../models/post/postModel");

const getPostById = async (postId) => {
        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "name username profilePicture"
                }
            });
        if (!post) {
            throw new Error("Post not found");
        }  
        
    return post;
};

module.exports = getPostById;