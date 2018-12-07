const supertest = require('supertest');
const {app, server} = require('../index');
const {Blog} = require('../models/blog');
const testBlogs = require('./testBlogs').blogs;
const {User} = require('../models/user');
const {blogsInDb, nonExistingId, generateUser} = require('./testHelper');

const api = supertest(app);

const myUser = 
{
    name: 'MyNewUser',
    username: 'MyNewUsername',
    password: 'sekrit',
    adult: true
};

beforeAll(async () => {
    //Empty the database
    await Blog.deleteMany({});
    await User.deleteMany({});

    // Create the test user
    await api
        .post('/api/users')
        .send(myUser)
        .expect(201);

});



afterAll(() => {
    server.close();
});

test('test with valid credinteals', async () => {

    await api
        .post('/api/login')
        .send(myUser)
        .expect(200);

});

test('test with invalid creadinteals', async () => {

    const invalidUser = {
        name: 'MyNewUser',
        username: 'MyNewUsername',
        password: 'NoSekrit',
        adult: true
    };

    await api
        .post('/api/login')
        .send(invalidUser)
        .expect(401);

});

test('test with invalid username', async () => {
    const invalidUser = {
        name: 'MyNewUser',
        username: 'MyIncorrectUsername',
        password: 'sekrit',
        adult: true
    };

    await api
        .post('api/login')
        .send(invalidUser)
        .expect(401);

});