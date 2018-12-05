
const supertest = require('supertest');
const {User} = require('../models/user');
const {validateUser} = require('../controllers/userRouter');
const {app, server} = require('../index');
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



// Reset database
beforeAll(async () => {
    await User.deleteMany({});
    // console.log();
});

afterAll( () => {
    server.close();
});