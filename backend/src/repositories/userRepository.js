const User = require("../models/user/userModel")

const userRepository = {
    create: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },

    findAll: async() => {
        return await User.find();
    },

    findById: async(id) => {
        return await User.findOne(id)
    },

    findByEmail: async(email) => {
        return await User.findOne({ email });
    },

    updateById: async (id, updateData) => {
        return await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    },

    deleteById: async (id) => {
        return await User.findByIdAndDelete(id);
    }
};

module.exports = userRepository;