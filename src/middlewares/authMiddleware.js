const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; //tive que adicionar isso porque se rodasse com bearer dava errokkk

  if (!token) {
    return res.status(401).json({ success: false, message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Token inválido." });
  }
};

module.exports = authMiddleware;
