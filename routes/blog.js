const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const { islogedIn } = require('../middleware/validateUser');
const Comment = require('../models/comment');
const User = require('../models/user');
 

router.get('/about',(req,res)=>{
    res.render('about');
})


router.get('/allBlog', async (req, res) => {
    const blogs = await Blog.find({}).sort({ "postedDate":-1});
    // console.log(blogs)
   
   
    res.render('allBlog', { blogs });
})

router.get('/newBlog', islogedIn, (req, res) => {
    res.render('newblog');
})


router.get('/showBlog/:id', async (req, res) => {
    var id = req.params.id;
    const blog = await Blog.findOne({ _id: id }).populate('comments');
    res.render('showBlog', { blog });
})
router.get('/showfavorite/:id', async (req, res) => {
    var id = req.params.id;
    const blog = await Blog.findOne({ _id: id }).populate('comments');
    res.render('showfavorite', { blog });
})

router.post('/newBlog', islogedIn, async (req, res) => {
    const { title, titleImage, desc, category } = req.body;
    const authorName = req.user.username
    Blog.create({
        title,
        titleImage,
        authorName,
        desc,category
    })
    res.redirect('/allBlog')
})


router.get('/edit/:id', islogedIn, async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog.authorName == req.user.username) {
        res.render('edit', { blog });
    }
    else{
        res.redirect('/allBlog');
    }
    
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, titleImage, desc, category } = req.body;
    const blog = await Blog.findById(id);


    blog.title = title;
    blog.titleImage = titleImage;
    blog.authorName = req.user.username;
    blog.desc = desc;
    blog.category = category;

    await blog.save();
    res.redirect('/');
});


router.get('/blog/:id/delete', islogedIn, async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog.authorName == req.user.username) {
        await Blog.findByIdAndDelete(id);
    }

    // req.flash('success','Product Deleted succesfully')
    res.redirect('/allBlog')

})


router.get('/myblog', islogedIn, async (req, res) => {
    const blogs = await Blog.find({authorName:req.user.username}).sort({ "postedDate": -1 });
    res.render('myblog',{blogs});
})


router.post('/blogs/:id/add',async (req,res)=>{
    if(req.user){
        const {id} = req.params;
    const blog = await Blog.findById(id);
    const comment = req.body.comment;
    console.log(comment)
    let x=  await Comment.create({username:req.user.username, comment:comment});

    blog.comments.push(x)
    blog.save()
    res.redirect('back')
    }
    else{
        res.redirect('/login')
    }
})

router.get('/comment/:id/delete', async(req,res)=>{
    if(req.user){
        const {id} = req.params;
    const comment =await Comment.findById(id);
    console.log(comment.username)
    if(req.user.username == comment.username ){
        await Comment.findByIdAndDelete(id);
    }
    
    res.redirect('back')
    }
    else{
        res.redirect('/login')
    }
})


router.get('/Categories/:category',async(req,res)=>{
    const {category} = req.params;
    const blogs =await Blog.find({category});

    if(blogs.length==0){
        res.redirect('back')
    }
    else{
        res.render('category',{blogs});
    }
    
})

// ****************** Add to favroutes ******************
 


router.post('/addToFavorites/:blogId/add',async(req,res)=>{
    if(req.user){
        const {blogId} = req.params;
    const userId = req.user._id;
     
    const user = await User.findById(userId);
    
    console.log(user)
    
    let existingBlog = await user.fav.find((favItem)=>{
        return favItem.blogId == blogId
    })
    if(existingBlog){}
    else{
        user.fav.push({blogId});
    }
    user.save() 
     
    res.redirect('back')
    }
    else{
        res.redirect('/login')
    }

})
 

router.post('/addToFavorites/:blogId/remove',async(req,res)=>{
    if(req.user){
        const {blogId} = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);

    let existingProduct =  user.fav.find((cartItem)=>{
        return cartItem.blogId == blogId
    })
     
    let ind = user.fav.indexOf(existingProduct);
    user.fav.splice(ind,1);
    user.save() 
     
    res.redirect('/favorites')
    }
    else{
        res.redirect('/login')
    }

})



router.get('/favorites',async (req,res)=>{
    if(req.user){
        const userId = req.user._id;
    const user = await User.findById(userId).populate('fav.blogId');
    console.log(user.fav)
    res.render('favorites',{user});   
    } 
    else{
        res.redirect('/login')
    }
})


module.exports = router;