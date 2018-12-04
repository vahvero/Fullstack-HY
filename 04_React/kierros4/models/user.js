
const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    username: String,
    passwordHash: String,
    adult: Boolean,
});


module.exports = User;

