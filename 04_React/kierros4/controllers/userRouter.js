const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

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
            adult: body.adult ? body.adult : true
        });

        const savedUser = await user.save();

        resp.status(201).json(
            User.format(savedUser)
        );
    } catch(e) {
        console.log(e);
        resp.status(500).json({error: 'Creation failure. ' + e});
    }
});

userRouter.get('/', async (req, resp) => {
    const users = await User.find({});
    resp.status(200).json(users.map(elem => User.format(elem)));
});

const validateUser = async (user) => {
    try {
        if(user.password.length <= 3) {
            return false;
        }
        
        const temp = await User.find({username: user.username});
        // console.log(temp);
        // console.log(temp.length === 0);
        if(temp.length === 0) {
            return true;
        }
        // console.log(temp);
        // console.log('Username in the database.')
        return false;
    }
    catch(e) {
        return false;
    }
};

// const formatUser = (user) => {
//     return {
//         id: user.id,
//         username: user.username,
//         name: user.name,
//         notes: user.notes
//     }
// }

module.exports = {userRouter, validateUser};