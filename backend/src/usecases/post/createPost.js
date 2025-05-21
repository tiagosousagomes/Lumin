const User = require("../../models/user/userModel");
const Post = require("../../models/post/postModel");

const createPost = async ({content, author, file }) => {
    try {
        const user = await User.findById(author);
        if (!user) {
            throw new Error("User not found");
        }

        const post = new Post({
            content,
            author,
            file
        });

        await post.save();
        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = createPost;