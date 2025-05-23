const Comment = require("../models/comment/commentModel");

const commentRepository = {
    createComment: async (userID, postID, content) => {
        const comment = new Comment({
            author: userID,
            post: postID,
            content
        });
        await comment.save();
    },

    findCommentsByPost: async (postID) => {
        return await Comment.find({ post: postID })
            .populate("author", "name username profilePicture")
            .sort({ createdAt: -1 });   
    },

    findCommentById: async (commentID) => {
        return await Comment.findById(commentID)
            .populate("author", "name username profilePicture")
            .populate("post", "title");
    },

    deleteComment: async (commentID) => {
        return await Comment.findByIdAndDelete(commentID);
    }
}

module.exports = commentRepository;
