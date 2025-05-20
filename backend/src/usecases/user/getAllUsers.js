const userRepository = require("../../repositories/userRepository");

module.exports = async (userRepository) => {
    const users = await userRepository.getAll();
    return users;
} 