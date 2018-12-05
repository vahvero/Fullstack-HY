const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const {User} = require('../models/user');
const {Blog} = require('../models/blog');

userRouter.post('/', async (req, resp) => {

    try {
        const body = req.body;

        const rand = await validateUser(body);

        if(!rand){
            resp.status(400).json({error: 'Invalid input values'});
            return;
        }

        const saltRounds = 10;

        const passwordHash = await bcrypt.hash(body.password, saltRounds);

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash,
            adult: body.adult ? body.adult : true,
            blogs: []
        });

        const savedUser = await user.save();

        resp.status(201).json(
            User.format(savedUser)
        );
    } catch(e) {
        // throw e;
        resp.status(500).json({error: 'Creation failure. ' + e});
    }
});

userRouter.get('/', async (req, resp) => {

    // await User.deleteMany({username: undefined});
    const users = await User.find({});

    // throw users;

    const formattedUsers = users.map(User.format);

    // throw formattedUsers;

    const promises = formattedUsers.map(elem => formatGetUsers(elem));

    const ret = await Promise.all(promises);

    // throw ret;

    resp.status(200).json(ret);
});

const formatGetUsers = async (user) => {
    const blogs = await Blog.find({user: user.id});
    const formattedBlogs = blogs.map(Blog.format);

    // throw formattedBlogs;
    const ret =  {
        id: user.id,
        username: user.username,
        name: user.name,
        adult: user.adult,
        blogs: formattedBlogs.map(elem => {
            return {
                id: elem.id,
                likes: elem.likes,
                author: elem.author,
                title: elem.title,
                url: elem.url,
            };
        }),
    };

    return ret;
};  

const validateUser = async (user) => {
    try {
        if(user.password.length <= 3) {
            // throw 'Password length too small';
            return false;
        }
        
        const temp = await User.find({username: user.username});

        // throw temp;
        // console.log(temp);
        // console.log(temp.length === 0);
        if(temp.length === 0) {
            return true;
        }
        // console.log(temp);
        // console.log('Username in the database.')
        // throw 'Temp  length non zero' + temp.length;
        return false;
    }
    catch(e) {
        // throw e;
        return false;
    }
};

module.exports = {userRouter, validateUser};
