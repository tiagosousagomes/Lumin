const userRepository = require("../../repositories/userRepository");

module.exports = async (id, updateData, userRepository) => {
    const user = await userRepository.update(id, updateData);
    if (!user) throw new Error("Usuário não encontrato");
    return user;
}