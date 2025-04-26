const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../config/users");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../utils/jwt");
const { CLIENT_URL, JWT_SECRET } = require("../config/dotenv");

const router = express.Router();

// Basic Auth (без токена)
// Проводится стандартная аутентификация с проверкой имени пользователя и пароля без использования токенов
router.post("/basic", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  res.json({ user: username }); // Возвращает только имя пользователя
});


// Basic Auth + Bearer-токен
// Аутентификация с использованием Basic Auth, после которой генерируется токен доступа (Bearer Token)
router.post("/basic-token", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  const token = generateAccessToken({ username: foundUser.username });
  res.json({ accessToken: token });  // Возвращает Bearer-токен
});

// Basic Auth + JWT (Access + Refresh Token)
// Аутентификация с использованием Basic Auth, после которой генерируются два токена: access и refresh
router.post("/jwt", (req, res) => {
  const { username, password } = req.body;
  const foundUser = Object.values(users).find(user => user.username === username);
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  const accessToken = generateAccessToken({ username: foundUser.username});
  const refreshToken = generateRefreshToken({ username: foundUser.username });
  res.json({ accessToken, refreshToken });  // Возвращает оба токена: access и refresh
});

// Basic Auth + Bearer-токен (Требуется передача в Authorization: Bearer <token>)
// Аутентификация с Basic Auth и передача токена в заголовке Authorization для получения доступа
router.post("/bearer", (req, res) => {
    const { username, password } = req.body;
    const foundUser = Object.values(users).find(user => user.username === username);
    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }
    const token = generateAccessToken({ username: foundUser.username });
    res.json({ token });  // Возвращает Bearer-токен
  });


  // Обновление JWT-токена
// Используется refresh-токен для получения нового access-токена, когда предыдущий истекает
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Нет токена" });

  const user = verifyToken(refreshToken);  // Проверка валидности refresh-токена
  if (!user) return res.status(403).json({ message: "Неверный refresh токен" });
 
  const newAccessToken = generateAccessToken({ username: user.username }); // Генерация нового access-токена
  res.json({ accessToken: newAccessToken }); // Возвращает новый access-токен
});

// Запуск авторизации через Yandex
// Инициирует процесс авторизации через Yandex с использованием Passport.js
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
