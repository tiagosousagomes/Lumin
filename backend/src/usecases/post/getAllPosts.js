const Post = require("../../models/post/postModel");

const getAllPosts = async () => {
    const posts = await Post.find()
        .sort({
            createAt: -1
        })
        .populate("author", "name username profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "author",
                select: "name username profilePicture"
            }
        });

        return posts;
};

module.exports = getAllPosts;