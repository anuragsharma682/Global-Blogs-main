module.exports.islogedIn = (req,res,next)=>{
    if(req.user){
        console.log(req.user)
         next()
    }
    else{
        // req.flash('success','Please Login!')
        res.redirect('/login')
    }
}