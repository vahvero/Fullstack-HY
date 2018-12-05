
const mongoose = require('mongoose');
const Blog = require('../models/blog');
// const User = mongoose.model('User', {
//     name: String,
//     username: String,
//     passwordHash: String,
//     adult: Boolean,
// });


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    passwordHash: String,
    adult: Boolean,
    blogs: [{type: mongoose.Schema.Types.ObjectId, ref: Blog}]
});

userSchema.statics.format  = (user) => {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        adult: user.adult,
        blogs: user.blogs
    };
};

const User = mongoose.model('User', userSchema);

module.exports = {User};


