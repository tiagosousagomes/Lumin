const User = require("../../models/user/userModel");
const Post = require("../../models/post/postModel");

const getPostsFromUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const posts = await Post.find({ author: userId })
        .sort({ createAt: -1 })
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

module.exports = getPostsFromUser;
