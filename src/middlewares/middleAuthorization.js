const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('..')

const JWT_EXPIRATION = "1h";

const userAutenticator = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          sucess: false,
          message: "Email ou senha incorretos.",
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          sucess: false,
          message: "Email ou senha incorretos.",
        });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      res.status(200).json({
        sucess: true,
        message: "Autenticação bem-sucedida",
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  module.exports = {userAutenticator}

