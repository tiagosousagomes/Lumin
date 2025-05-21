const bcrypt = require("bcrypt");
const userRepository = require("../../repositories/userRepository");

module.exports = async({ name, username, email, password, avatarFile, headerImagFile }) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser){
        throw new Error("Email já em uso")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        name, 
        username,
        email,
        password: hashedPassword,
        avatar: avatarFile
        ? { data: avatarFile.buffer, contentType: avatarFile.mimetype }
        : undefined,
        headerImage: headerImagFile
        ? {data: headerImagFile.buffer, contentType: headerImagFile.mimetype}
        : undefined,
    };

    const user = await userRepository.create(userData);
    return user;
}