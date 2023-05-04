const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { googleClientId, googleClientSecret } = require("../config/keys");

const User = require("../models/User");

passport.serializeUser((user, done) => {
  // "user" in this case is the existing user or the newly created user from our google strategy

  // We don't have to say user._id coz it automatically refers to the user._id . It's basically a shortcut.
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // If a record with that id is found
        done(null, existingUser);
      } else {
        // If no record with the id is found
        const user = await User.create({ googleId: profile.id });
        done(null, user);
      }
    }
  )
);
