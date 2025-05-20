const userRepository = require("../../repositories/userRepository");

module.exports = async (id, userRepository) => {
    const deletedUser = await userRepository.delete(id);
    if (!deletedUser)  throw new Error("Usuário não encontrado");
    return deletedUser;
};