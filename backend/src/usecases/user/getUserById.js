const userRepository = require("../../repositories/userRepository");

module.exports = async (id) => {
    const user = await userRepository.getById(id);
    if(!user) throw new Error("Usuário não encontrado");
    return user;
}