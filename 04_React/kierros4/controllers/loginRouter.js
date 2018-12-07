const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginRouter = require('express').Router();
const {User} = require('../models/user');
const {Blog} = require('../models/blog');

loginRouter.post('/', async (req, resp) => {
    const body = req.body;

    const user = await User.findOne({
        username: body.username,
    });

    const pwCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

    if(!(user && pwCorrect)) {
        return resp.status(401).json('Invalid password or username');
    }

    const userToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userToken, process.env.SECRET);

    resp.status(200).send({
        token, 
        username: user.username,
        name: user.name
    });


});


module.exports = {loginRouter};