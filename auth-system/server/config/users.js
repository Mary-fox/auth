//Фиктивные пользователи
const bcrypt = require("bcryptjs");

const users = {
    user1: { username: "Mary", password: bcrypt.hashSync("password", 10) }
  };
  
  module.exports = users;
  