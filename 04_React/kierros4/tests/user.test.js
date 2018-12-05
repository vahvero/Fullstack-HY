
const supertest = require('supertest');
const {User} = require('../models/user');
const {validateUser} = require('../controllers/userRouter');
const {app, server} = require('../index');
const {Blog} = require('../models/blog');
const {generateUser} = require('./testHelper');

// const {generateUser} = require('./testHelper');
const api = supertest(app);

const invalidUser = {
    name: 'InvalidUser',
    username: 'InvalidUser',
    password: '12',
    adult: false,
    blogs: []
};

const validUser = {
    name: 'validUser',
    username: 'validUser',
    password: 'sikret',
    adult: false,
    blogs: []
};



test('test invalid user post', async () => {

    const response = await api.post('/api/users')
        .send(invalidUser)
        .expect(400);
    await User.deleteOne({username: invalidUser.username});
});

test('test valid user post', async () => {

    const user = {
        name: 'validUser123',
        username: 'validUser123',
        password: 'sikret',
        adult: false,
        blogs: []
    };
    

    const response = await api.post('/api/users')
        .send(user)
        .expect(201);
    // Remove the valid user
    await User.deleteOne({username: validUser.username});


});

test('Test validate with invalid user', async () => {

    // const user = new User({
    //     invalidUser
    // });
    // await user.save();
    const ret = await validateUser(invalidUser);
    expect(ret).toEqual(false);
    await User.deleteOne(invalidUser);
});

test('Test validate with valid user', async () => {
    // const user = new User({
    //     validUser
    // });
    // await user.save();
    await User.deleteMany({username: validUser.username});

    const ret = await validateUser(validUser);
    expect(ret).toEqual(true);
    await User.deleteOne(validUser);

});

test('Test with existing username', async () => {

    const existingUser = new User();
    await existingUser.save();

    const newUser = {
        name: 'InvalidUsername',
        username: existingUser.username,
        password: 'sikrit',
    };

    await api.post('/api/users')
        .send(newUser)
        .expect(400);
});

test('Test GET users', async () => {

    const user = new User();
    await user.save();

    const blog = new Blog({
        user: user._id,
    });
    await blog.save();

    const response = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const body = response.body;
    
    const blogs = body.map(elem => elem.blogs);
    expect(blogs).toBeDefined();

    const userResponse = body.find((elem) => {
        return elem.username === user.username;
    });
    
    expect(userResponse).toBeDefined();

    expect(userResponse.blogs).toContain(blog._id);

});
// Reset database
beforeAll(async () => {
    // await Blog.deleteMany({});
    await User.deleteMany({});
    // const user = await generateUser();
    // const blogObjects = testBlogs.map(elem => {
    //     elem.user = user.id;
    //     return new Blog(elem);
    // });
    // const promises = blogObjects.map(blog => blog.save());
    // await Promise.all(promises);

});

//Close the server connection
afterAll(() => {
    server.close();
});