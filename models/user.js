const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    fav: [
        {
            _id: false,
            blogId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Blog'
            }
        }
    ]
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;