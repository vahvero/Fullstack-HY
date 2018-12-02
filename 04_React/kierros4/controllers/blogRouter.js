const blogRouter = require('express').Router();
const Blog = require('../models/blog');

const formatBlog = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
    };
};

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map(formatBlog))
        });
});

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body);

    blog
        .save()
        .then(result => {
            response.status(201).json(result);
        })
        .catch(e => {
            console.log(e);
            response.status(304).json({});
        });
});

// blogRouter.delete('/:id' (request, response) => {

// })

module.exports = blogRouter;