const userRepository = require("../../repositories/userRepository");

module.exports = async () => {
    const users = await userRepository.getAll();
    return users;
} 