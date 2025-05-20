const userRepository = require("../../repositories/userRepository");

module.exports = async (id, userRepository) => {
    const user = await userRepository.getById(id);
    if(!user) throw new Error("Usuário não encontrado");
    return user;
}