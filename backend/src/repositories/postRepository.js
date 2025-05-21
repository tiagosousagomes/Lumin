const Post = require('../models/post/postModel');

const postRepository = {
    create: async (postData) => {
        const post = new Post(postData);
        return await post.save();
    },

    findAll: async () => {
        return Post.find()
            .sort({
                createAt: -1
            })
            .populate("author", "name username profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "name username profilePicture"
                },
            });
    },

    findByUserId: async (userId) => {
        return Post.find({
            author: userId
        })
            .sort({createAt: -1})
            .populate("author", "name username profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "name username profilePicture"
                },
            });
    },

    update: async (id, data) => {
        return Post.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("author", "name username profilePicture");
    },

    remove: async (id) => {
        return Post.findByIdAndDelete(id);
    },

    likeOrDislike: async (postId, userId) => {
        const post = await Post.findById(postId);
        if (!post) return null;

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
            likes: post.likes,
        };
    }
};

module.exports = postRepository;