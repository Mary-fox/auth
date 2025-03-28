//Функции для работы с JWT
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/dotenv");

const generateAccessToken = (user) => 
  jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) => 
  jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "7d" });


const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
