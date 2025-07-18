const express = require('express');
const passport = require('passport');
const User = require('../models/UserSchems');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const authRouter = express.Router();
require('dotenv')
// Initialize passport
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.status(401).send('You are not authorized to view this page. Please login first.');
}

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passRequestToCallback: true,
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value
        });
        await newUser.save();
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id); // Store only user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
authRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));

authRouter.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  })
);


authRouter.get('/protected', isLoggedIn,(req, res) => {
  console.log(req.user);

  res.redirect('http://localhost:5173/dashboard');
});

authRouter.get('/auth/failure', (req, res) => {
  res.send('Failed to authenticate');
});

authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});



authRouter.get('/api/auth/user', (req, res) => {
  if (req.user) {
    return res.json({
      loggedIn: true,
      userName: req.user.name,
      profilePicture: req.user.profilePicture
    });
  }
  res.json({ loggedIn: false });
});

module.exports = authRouter;