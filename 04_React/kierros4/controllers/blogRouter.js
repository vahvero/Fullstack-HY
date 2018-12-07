const jwt = require('jsonwebtoken');

const blogRouter = require('express').Router();
const {Blog, validateBlog} = require('../models/blog');
const {User} = require('../models/user');

const getToken =(req) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

blogRouter.get('/', async (request, response) => {
    // Blog
    //     .find({})
    //     .then(blogs => {
    //         response.json(blogs.map(Blog.format));
    //     });

    const blogs = await Blog.find({});
    
    const formattedBlogs = blogs.map(Blog.format);

    const promises = formattedBlogs.map(elem => formatGetBlog(elem));

    const ret = await Promise.all(promises);

    // console.log(ret);

    response.status(200).json(ret);
});


const formatGetBlog = async (blog) => {
    const user = await User.findById(blog.user);
    return {
        id: blog.id,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
        },
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
    };
};


blogRouter.post('/', async (request, response) => {
    try {
        const id = request.body.user;
        if(id === undefined) {
            throw 'User identity not defined';
        }

        const token = getToken(request);
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if(!token || !decodedToken.id) {
            return response.status(401).json({error: 'token missing or invalid'});
        }

        let blog = request.body;

        const user = await User.findById(decodedToken.id);

        blog = validateBlog(blog);

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