var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var configAuth = require('./auth');
var GoogleDriveStrategy = require('passport-google-drive').Strategy;

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  passport.use(new GoogleDriveStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      return done(null, profile);
    });


  }
));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
  passport.use('localuser-signup', new LocalStrategy({
    usernameField: 'name',
    emailField: 'email',
    passReqToCallback: true,
  },
  function(req, name, email, done) {
    process.nextTick(function() {

      User.findOne({ 'localuser.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.localuser.email = email;
          newUser.localuser.name = names;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);
    });
  }));

  passport.use('localuser-login', new LocalStrategy({
    nameField: 'name',
    emailField: 'email',
    passReqToCallback: true,
  },
  function(req, name, email, done) {
    User.findOne({ 'localuser.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      return done(null, user);
    });
  }));

//   passport.use(new GoogleStrategy({
//   clientID: configAuth.googleAuth.clientID,
//   clientSecret: configAuth.googleAuth.clientSecret,
//   callbackURL: configAuth.googleAuth.callbackURL,
// },
//   function(token, refreshToken, profile, done) {
//     process.nextTick(function() {
//       User.findOne({ 'google.id': profile.id }, function(err, user) {
//         if (err)
//           return done(err);
//         if (user) {
//           return done(null, user);
//         } else {
//           var newUser = new User();
//           newUser.google.id = profile.id;
//           newUser.google.token = token;
//           newUser.google.name = profile.displayName;
//           newUser.google.email = profile.emails[0].value;
//           newUser.save(function(err) {
//             if (err)
//               throw err;
//             return done(null, newUser);
//           });
//         }
//       });
//     });
//   }));


  //
  // passport.use(new GoogleStrategy({
  //   clientID: configAuth.googleAuth.clientID,
  //   clientSecret: configAuth.googleAuth.clientSecret,
  //   callbackURL: configAuth.googleAuth.callbackURL,
  // },
  //   function(token, refreshToken, profile, done) {
  //     process.nextTick(function() {
  //       User.findOne({ 'google.id': profile.id }, function(err, user) {
  //         if (err)
  //           return done(err);
  //         if (user) {
  //           return done(null, user);
  //         } else {
  //           var newUser = new User();
  //           newUser.google.id = profile.id;
  //           newUser.google.token = token;
  //           newUser.google.name = profile.displayName;
  //           newUser.google.email = profile.emails[0].value;
  //           newUser.save(function(err) {
  //             if (err)
  //               throw err;
  //             return done(null, newUser);
  //           });
  //         }
  //       });
  //     });
  //   }));

};
