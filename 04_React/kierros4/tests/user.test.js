
const supertest = require('supertest');
const User = require('../models/user');
const {validateUser} = require('../controllers/userRouter');
const {app, server} = require('../index');

const api = supertest(app);

const invalidUser = {
    name: 'InvalidUser',
    username: 'InvalidUser',
    password: 'hh',
    adult: false
};

const validUser = {
    name: 'validUser',
    username: 'validUser',
    password: 'sikret',
    adult: false
};

test('test invalid user post', async () => {
    await api.post('/api/users')
        .send(invalidUser)
        .expect(400);

    await User.deleteOne({username: invalidUser.username});
});

test('test valid user post', async () => {
    await api.post('/api/users')
        .send(validUser)
        .expect(201);
    
    // Remove the valid user
    await User.deleteOne({username: validUser.username});


});

test('Test validate with invalid user', async () => {
    
    const ret = await validateUser(invalidUser);
    expect(ret).toEqual(false);

});

test('Test validate with valid user', async () => {
    
    const ret = await validateUser(validUser);
    expect(ret).toEqual(true);

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