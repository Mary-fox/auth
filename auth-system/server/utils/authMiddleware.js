//Мидлвар для защиты маршрутов
const { verifyToken } = require("./jwt");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена" });
  }

  const token = authHeader.split(" ")[1]; 
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: "Неверный или истекший токен" });
  }

 

  req.user = decoded; 
  next();
};

module.exports = { authenticateJWT };
