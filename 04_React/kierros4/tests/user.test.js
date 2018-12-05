
const supertest = require('supertest');
const {User} = require('../models/user');
const {validateUser} = require('../controllers/userRouter');
const {app, server} = require('../index');
const {Blog} = require('../models/blog');
const {generateUser} = require('./testHelper');
const testBlogs = require('./testBlogs').blogs;

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

//Reset the database
beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const user = await generateUser();
    const blogObjects = testBlogs.map(elem => {
        elem.user = user.id;
        return new Blog(elem);
    });


    const promises = blogObjects.map(blog => {
        blog.save();
        // user.blogs = user.blogs.concat(blog._id);
    });

    const user1 = await User.findById(user.id);

    // throw blogObjects.map(elem => elem._id);

    blogObjects.map(
        (elem) => {
            user1.blogs = user1.blogs.concat(elem._id);
        }
    );
    await user1.save();
    await Promise.all(promises);

    const user2 = await User.findById(user.id);

    if(user2.blogs.length === 0) {
        throw 'Enviroment error';
    }

});

//Close the server connection
afterAll(() => {
    server.close();
});

test('test invalid user post', async () => {

    await api.post('/api/users')
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
    

    await api.post('/api/users')
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

    await User.findByIdAndDelete(existingUser._id);
});

test('Test GET users', async () => {

    // const user = new User();
    // await user.save();

    // const blog = new Blog({
    //     user: user._id,
    // });
    // await blog.save();

    const response = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const body = response.body;

    expect(body).toBeDefined();
    let users = await User.find({});
    users = users.map(User.format);
    expect(body.length).toEqual(users.length);

    // throw body;

    body.map((elem) => {
        expect(elem).toBeDefined();
        expect(elem.id).toBeDefined();
        expect(elem.username).toBeDefined();
        expect(elem.name).toBeDefined();
        expect(elem.adult).toBeDefined();
        expect(elem.blogs).toBeDefined();
    });

    // const blogs = body.map(elem => elem.blogs);
    // expect(blogs).toBeDefined();

    // const userResponse = body.find((elem) => {
    //     return elem.username === user.username;
    // });
    
    // expect(userResponse).toBeDefined();

    // expect(userResponse.blogs).toContain(blog.id);

    // await User.deleteOne(user);
    // await Blog.deleteOne(blog);

});
