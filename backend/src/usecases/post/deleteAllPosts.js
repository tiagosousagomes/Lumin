const Post = require("../../models/post/postModel");

const deleteAllPosts = async () => {
  await Post.deleteMany({});
};

module.exports = deleteAllPosts;