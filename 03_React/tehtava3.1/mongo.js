
const mongoose = require('mongoose');

const url = 'mongodb://JoeGen:uDKxpnYe7Dc3xqQ@ds125723.mlab.com:25723/fullstack-io';

mongoose.connect(url);

const Person = mongoose.model(
    'Note', {
        name: String,
        number: String
    }
)

const newName = process.argv[2];

const newNumber = process.argv[3];

console.log(newName, newNumber);

if(newName || newNumber) {
    const person = new Person({
        name: newName, 
        number: newNumber
    })
    person
    .save()
    .then(
        response => {
            console.log("Person saved.")
        }
    )
}

else {
    Person
    .find({})
    .then(
        response => {
            response.forEach(
                person => {
                    console.log(person);
                }
            )
        }
    )
}

mongoose.connection.close();