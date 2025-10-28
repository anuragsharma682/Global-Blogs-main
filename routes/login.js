const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/login',   (req, res) => {
    res.render('login');
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.username = req.body.username;
    // console.log(req.session.username);
    res.redirect('/');
  });


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      // req.flash('success','BYY')
      res.redirect('/');
    });
  });
  
module.exports = router;