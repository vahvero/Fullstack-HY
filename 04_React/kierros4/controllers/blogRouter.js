const blogRouter = require('express').Router();
const {Blog, validateBlog} = require('../models/blog');
const {User} = require('../models/user');

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map(Blog.format));
        });
});

blogRouter.post('/', async (request, response) => {
    try {
        const id = request.body.user;
        if(id === undefined) {
            throw 'User identity not defined';
        }
        let blog = request.body;

        const user = await User.findById(id);

        // console.log(blog);
        // console.log(user);

        blog = validateBlog(blog);

        // console.log(blog);

        if(!blog) {
            throw 'Invalid blog values';
        }

        const newBlog = new Blog(blog);


        const result = await newBlog.save();
        user.blogs = user.blogs.concat(newBlog._id);
        await user.save();

        response.status(201).json(Blog.format(result));

    }
    catch(e) {
        // throw e;
        response.status(400).json({error: e});
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