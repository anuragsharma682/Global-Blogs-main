const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


router.get('/register',  (req, res) => {
    res.status(200).render('register');
})

router.post('/register', async (req, res) => {
    // const {username, email, password} = req.body;
    // const hashPassword = bcrypt.hashSync(password,12);
    const {username,password,email} = req.body;
    let newUser = new User({username,email});
    await User.register(newUser,password)
    // res.redirect('/login')
     
    res.status(201).redirect('/login');

})

module.exports = router;