const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();


// basicamente fiz uma alteração completa nessa parte, tirei tudo como estava antes 
// e criei um sistema de tokens temporarios e validação, para não ter erro de segurança.
const JWT_EXPIRATION = "15m";  
const JWT_REFRESH_EXPIRATION = "7d"; 

let refreshTokens = []; 

const userAuthenticator = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email ou senha incorretos." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Email ou senha incorretos." });
    }

 
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

    refreshTokens.push(refreshToken); 
    res.status(200).json({
      success: true,
      message: "Autenticação bem-sucedida",
      accessToken,
      refreshToken, 
      user: { _id: user._id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};


const refreshTokenHandler = (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ success: false, message: "Refresh Token inválido" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Refresh Token expirado ou inválido" });

    const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.json({ success: true, accessToken });
  });
};


const logoutUser = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token); 
  res.status(200).json({ success: true, message: "Logout bem-sucedido" });
};

module.exports = { userAuthenticator, refreshTokenHandler, logoutUser };
