const blogRouter = require('express').Router();
const {Blog, validateBlog} = require('../models/blog');

// const formatBlog = (blog) => {
//     return {
//         id: blog._id,
//         title: blog.title,
//         author: blog.author,
//         url: blog.url,
//         likes: blog.likes,
//     };
// };

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map(Blog.format));
        });
});

blogRouter.post('/', async (request, response) => {
    let blog = request.body;

    // console.log(blog);

    blog = validateBlog(blog);

    // console.log(blog);

    if(!blog) {
        response.status(400).json({});
        return;
    }

    const newBlog = new Blog(blog);

    // newBlog
    //     .save()
    //     .then(result => {
    //         response.status(201).json(result);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         response.status(304).json({});
    //     });
    try {
        const result = await newBlog.save();
        response.status(201).json(result);

    }
    catch(e) {
        console.log(e);
        response.status(304).json({});
    }
    
});

blogRouter.delete('/:id', async (request, response) => {

    try {
        await Blog.remove({
            _id: request.params.id,
        });
        response.status(200).json({});
    } 
    catch(e) {
        response.status(404).json({});
    }
});

blogRouter.put('/:id', async (request, response) => {

    const id = request.params.id;
    const payload = request.body;
    try {
        await Blog.findByIdAndUpdate(id, payload);
        response.status(200).json({});
    }
    catch(e) {
        response.status(404).json({});
    }

});

module.exports = blogRouter;