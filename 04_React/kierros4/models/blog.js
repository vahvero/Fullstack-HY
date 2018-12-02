
const mongoose = require('mongoose');

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
});

const validateBlog = (blog) => {
    if(blog.title == undefined) {
        blog.title = 'DefaultTitle';
    }
    if(blog.author == undefined) {
        blog.author = 'DefaultAuthor';
    }
    if(blog.url == undefined) {
        blog.url = 'http://www.google.com';
    }
    if(blog.likes == undefined || blog.likes < 0){
        blog.likes = 0;
    }
    // console.log(blog);
    return blog;
};

module.exports = {Blog, validateBlog};