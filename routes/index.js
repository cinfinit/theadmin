var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var {ObjectID}=require('mongodb');



router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));
router.get('/usercreated', function(req, res) {
  res.render('usercreated.ejs');
});
 //this is correct
// router.post('/login', passport.authenticate('local-login', {
//   // successRedirect: '/auth/drive',
//   successRedirect: '/dashboard',
//   failureRedirect: '/login',
//   failureFlash: true,
// }));

router.post('/createuser', passport.authenticate('localuser-signup', {
  successRedirect: '/usercreated',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/users',(req,res)=>{
  User.find().then((doc)=>{
    // console.log(doc[1].localuser.name);
    // res.send({todos});
   // res.render('showuser.ejs',{uname:doc[].localuser.name,email:doc[].localuser.email});
   res.render('showuser.ejs',{usersArray:doc});
  },(e)=>{
    res.status(400).send(e);
  });
});
router.post('/userlogin', passport.authenticate('localuser-login', {
  //u have to create this page ''/userlogin' specially for users
  // successRedirect: '/auth/drive',
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//
// router.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/somethingnew',
//   failureRedirect: '/',
// }));

router.get('/dashboard',function (req,res){
  res.render('dashboard.ejs');
});
router.get('/createuser',function (req,res){
  res.render('createuser.ejs');
});
router.get('/deleteuser',(req,res)=>{
  User.find().then((doc)=>{
    // console.log(doc[1].localuser.name);
    // res.send({todos});
   // res.render('showuser.ejs',{uname:doc[].localuser.name,email:doc[].localuser.email});
   res.render('deleteuser.ejs',{usersArray:doc});
  },(e)=>{
    res.status(400).send(e);
  });
});
//this is working u need to use ajax with jq to create a listener event so as to send delete request
router.delete('/delete/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  User.findByIdAndRemove(id).then((doc)=>{
    if(!doc){
      return res.status(400).send();
    }
    res.send(doc);
  }).catch((e)=>{
    res.status(400).send();
  });
});
//same goes for this
router.patch('/update/:id',(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['name','isallowed','email']);
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((doc)=>{
    res.send({doc});
  }).catch((e)=>{
    res.status(400).send();
  });
});
// router.delete('/delete/:email',(req,res)=>{
//   var email=req.params.email;
//   console.log(email);
//   User.find({localuser:'email'}).remove().exec();
//   console.log('removed '+ email);
//   res.send(email+ 'is removed');
// });
// router.delete('/delete/:email',(req,res)=>{
//   var email=req.params.email;
//   console.log(email);
//   User.findOneAndRemove({email}).then((doc)=>{
//     if(!email){
//       return res.status(400).send();
//     }
//     res.send('it is removed');
//     // res.send("removed" + doc);
//   }).catch((e)=>{
//     res.status(400).send();
//   });
// });

router.get('/auth/drive',
  passport.authenticate('google-drive',{scope:['https://www.googleapis.com/auth/drive']}));
  // function (req, res){
  //   // The request will be redirected to Google for authentication, so this
  //   // function will not be called.
  // });

// GET /auth/google-drive/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/drive/callback',
  passport.authenticate('google-drive', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/somethingnew');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
