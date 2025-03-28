const express = require("express");
const { authenticateJWT } = require("../utils/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticateJWT, (req, res) => {
    console.log("Decoded user в роутере:", req.user);  // Проверяем содержимое токена
    res.json({ message: `Добро пожаловать, ${req.user.username}` });
});

module.exports = router;
