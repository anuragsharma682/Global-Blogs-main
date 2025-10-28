const express = require('express');
const app = express()
const PORT = 4000;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Blog = require('./models/blog');
const {dummydata} = require('./dummy');
//  Blog.create(dummydata)
const path = require('path');

mongoose.connect('mongodb+srv://Abhishek-Porwal:Fwr3AL6bxDUNxxX9@cluster0.868ebly.mongodb.net/global-blogs')
    .then(() => { console.log({ sucess: true }) })
    .catch((err) => { console.log(err) })


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // store: MongoStore.create({mongoUrl:'mongodb://127.0.0.1:27017/practice',collectionName:'sessions'}),
    // cookie:{maxAge:1000}
}))
 

app.use('/public/', express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.user = req.user;
    // res.locals.success = req.flash('success');
    next()
})

app.get('/', async(req, res) => {
    const blogs = await Blog.find({}).sort({ "comments": -1});
    // const blogs2 = await Blog.find({}).sort({ "comments": -1});
     
    
    
    
    res.status(200).render('home',{blogs});
})


//  ********************** ROUTES ****************

const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const blogRoutes = require('./routes/blog');
// const commentRoutes = require('./routes/comment');
// const { compareSync } = require('bcrypt');



app.use(loginRoutes);
app.use(registerRoutes);
app.use(blogRoutes);

 

app.listen(PORT, () => {
    console.log("Server Started ", PORT);
})