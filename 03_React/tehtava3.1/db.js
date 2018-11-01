
const mongoose = require('mongoose');

require('dotenv').config();

const url = process.env.NODE_ENV !== 'production' ? process.env.DEV_URL : process.env.PROD_URL ;

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

const formatPerson = (elem) => {
    // console.log("Formatting ", elem);
    return {
        name: elem.name,
        number: elem.number,
        id: elem._id,
    };
};

module.exports = {
    Person: Person,
    formatPerson: formatPerson,
};
