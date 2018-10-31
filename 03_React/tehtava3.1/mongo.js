
const mongoose = require('mongoose');

const url = 'mongodb://JoeGen:uDKxpnYe7Dc3xqQ@ds125723.mlab.com:25723/fullstack-io';

mongoose.connect(url, {useNewUrlParser: true})
    .then(() => {console.log('Connected.');},
        err => {console.log('Returned error.' + err);}
    );

const Person = mongoose.model(
    'Person', {
        name: String,
        number: String
    }
);

const newName = process.argv[2];

const newNumber = process.argv[3];

console.log(newName, newNumber);

if(newName || newNumber) {
    const person = new Person({
        name: newName, 
        number: newNumber
    });
    person
        .save()
        .then(
            () => {
                console.log('Person saved.');
            }
        )
        .then(
            () => {
                closeConnection();
            }
        );
}

else {
    Person
        .find({})
        .then(
            response => {
                console.log(response);
                // response.forEach(
                //     person => {
                //         console.log(person.name + ' : ' + person.number);
                //     });

            }
        )
        .then(() => {
            closeConnection();
        });
}

const closeConnection = () => {
    mongoose.connection.close();
};