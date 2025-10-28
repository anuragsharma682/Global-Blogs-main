const mongoose = require('mongoose');
const date = new Date();
// console.log(`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`);
 

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    authorName: {
        type:String,
        required:true,
        trim:true
    },
    
    postedDate:{
        type:String,
        default:`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    },
    titleImage:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type: String,
        default:'All'
    }
    ,
    desc:{
        type:String,required:true,trim:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})



const Blog = mongoose.model('Blog',blogSchema);
 

module.exports= Blog;