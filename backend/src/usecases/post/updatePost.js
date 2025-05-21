const Post = require("../../models/post/postModel");

const updatePost = async (id, { content, file }) => {
    const updateData = {
        content,
        updateAt: Date.now()
    };

    if (file) {
        updateData.image = {
            data: file.buffer,
            contentType: file.mimetype
        };
    }

    const post = await Post.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate("author", "name username profilePicture");

    if (!post) {
        throw new Error("Post não encontrado");
    }

    return post;
};

module.exports = updatePost;
