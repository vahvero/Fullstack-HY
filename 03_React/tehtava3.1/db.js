
const mongoose = require('mongoose');

const url = 'mongodb://JoeGen:uDKxpnYe7Dc3xqQ@ds125723.mlab.com:25723/fullstack-io';

mongoose.connect(url,  { useNewUrlParser: true } )
.then(() => {console.log("Connected.")},
    err => {console.log("Returned error.")}
 );

const Person = mongoose.model(
    'Person', {
        name: String,
        number: String
    }
)

const formatPerson = (elem) => {
    // console.log("Formatting ", elem);
    return {
        name: elem.name,
        number: elem.number,
        id: elem._id,
    }
}

module.exports = {
    Person: Person,
    formatPerson: formatPerson,
}