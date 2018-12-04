
const mongoose = require('mongoose');

// const Blog = mongoose.model('Blog', {
//     title: String,
//     author: String,
//     url: String,
//     likes: Number
// });

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

blogSchema.statics.format = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
    };
};

const Blog = mongoose.model('Blog', blogSchema);

// const formatBlog = (blog) => {
//     return {
//         id: blog._id,
//         title: blog.title,
//         author: blog.author,
//         url: blog.url,
//         likes: blog.likes,
//     };
// };


const validateBlog = (blog) => {
    if(blog.title == undefined) {
        return false;
    }
    if(blog.author == undefined) {
        blog.author = 'DefaultAuthor';
    }
    if(blog.url == undefined) {
        return false;
    }
    if(blog.likes == undefined || blog.likes < 0){
        blog.likes = 0;
    }
    // console.log(blog);
    return blog;
};

module.exports = {Blog, validateBlog};