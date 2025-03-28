const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../config/users");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../utils/jwt");
const { CLIENT_URL, JWT_SECRET } = require("../config/dotenv");

const router = express.Router();

// Basic Auth (без токена)
router.post("/basic", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  res.json({ user: username });
});



// Basic Auth + Bearer-токен
router.post("/basic-token", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  const token = generateAccessToken({ username: foundUser.username });
  res.json({ accessToken: token });
});

//Basic Auth + JWT (Access + Refresh Token)
router.post("/jwt", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  const accessToken = generateAccessToken({ username: foundUser.username});
  const refreshToken = generateRefreshToken({ username: foundUser.username });
  res.json({ accessToken, refreshToken });
});

//  Basic Auth + Bearer-токен (Требуется передача в Authorization: Bearer <token>)
router.post("/bearer", (req, res) => {
    const { username, password } = req.body;
    const foundUser = Object.values(users).find(user => user.username === username);
    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }
    const token = generateAccessToken({ username: foundUser.username });
    res.json({ token });
  });

// Обновление JWT-токена
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Нет токена" });

  const user = verifyToken(refreshToken);
  if (!user) return res.status(403).json({ message: "Неверный refresh токен" });

  const newAccessToken = generateAccessToken({ username: user.username });
  res.json({ accessToken: newAccessToken });
});

// Запуск авторизации через Yandex
router.get("/yandex", passport.authenticate("yandex"));

// Обработка callback после успешного входа
router.get(
  "/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/" }),
  (req, res) => {
    const token = generateAccessToken({ username: req.user.user, email: req.user.email });
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;
