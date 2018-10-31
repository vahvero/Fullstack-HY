
const mongoose = require('mongoose');

const url = 'mongodb://JoeGen:uDKxpnYe7Dc3xqQ@ds125723.mlab.com:25723/fullstack-io';

mongoose.connect(url,  { useNewUrlParser: true } )
    .then(() => {
        console.log('Connected.');},
    err => {
        console.log('Returned error.' + err);
    }
    );

const Person = mongoose.model(
    'Person', {
        name: String,
        number: String
    }
);

module.exports = {
    Person: Person,
};