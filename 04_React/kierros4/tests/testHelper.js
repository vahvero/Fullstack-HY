
const {Blog} = require('../models/blog');

// const testBlogs = require('./testBlogs').blogs;



const nonExistingId = async () => {
    const blog = new Blog();
    await blog.save();
    await blog.remove();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(elem => Blog.format(elem));
};

module.exports = {
    nonExistingId, blogsInDb
}