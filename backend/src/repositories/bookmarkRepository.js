const Bookmark = require('../models/bookmark/bookmarkModel');
const { path } = require('../models/follow/followSchema');

const bookmarkRepository = {
    findBookmark: async (userID, postID) => {
        return await Bookmark.findOne({ user: userID, post: postID });
    },

    createBookmark: async (userID, postID) => {
        const bookmark = new Bookmark({
            user: userID,
            post: postID
        });
        return await bookmark.save();
    },

    deleteBookmark: async (bookmarkID) => {
        return await Bookmark.findByIdAndDelete(bookmarkID);
    },

    findBookmarksByUser: async (userID) => {
        return await Bookmark.find({ user: userID })
        .populate({
            path: 'post',
            populate: {
                path: 'author',
                select: 'name username profilePicture'
            }
        })
        .sort({ createdAt: -1 });
    },

    countBookmarksByPost: async (postID) => {
        return await Bookmark.countDocuments({ post: postID });
    }
};

module.exports = bookmarkRepository;