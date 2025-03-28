const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./config/dotenv");
require("./config/passport");

const { PORT, CLIENT_URL } = require("./config/dotenv");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
//  Добавляем поддержку сессий 
app.use(
    session({
      secret: "supersecret", 
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/", protectedRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
