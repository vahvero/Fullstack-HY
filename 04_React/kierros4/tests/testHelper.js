
const {Blog} = require('../models/blog');
const {User} = require('../models/user');
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

const generateUser = async () =>  {

    const user = new User({
        name: 'validUser',
        username: 'validUser',
        password: 'sikret',
        adult: false,
        blogs: []
    });
    await user.save();

    let testUser = await User.findById(user._id);
    testUser = User.format(testUser);

    return testUser;

};

module.exports = {
    nonExistingId, blogsInDb, generateUser
};
