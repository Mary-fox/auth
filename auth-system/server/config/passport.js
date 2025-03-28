//(Настройка Yandex OAuth 2.0
const passport = require("passport");
const YandexStrategy = require("passport-yandex").Strategy;
const { YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET } = require("./dotenv");

passport.use(
  new YandexStrategy(
    {
      clientID: YANDEX_CLIENT_ID,
      clientSecret: YANDEX_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/yandex/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { user: profile.displayName, email: profile.emails[0].value });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
