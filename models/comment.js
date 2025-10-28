const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username:{
        type: String
    },
    comment:[
        {
            type:String,
            trim:true
        }
    ]
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;