const crypto = require("crypto");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = "aes-256-cbc";

module.exports = (encryptedContent, iv) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encryptedContent, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
