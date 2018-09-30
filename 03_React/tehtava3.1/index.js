
const express = require('express');

const app = express();

const port = 3001;

let notes = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    const len = notes.length;
    const time = new Date();
    res.send(
        `<p>Puhelin luettelossa on ${len} numeroa.</p>
        <p>${time}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find((elem) => {
        return elem.id === id
    });

    if(!note){
        res.status(404).json(note);
    }
    else {
        res.json(note);
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const ind = notes.findIndex(
        (elem) => {
            return elem.id === id;
        }
    )
    console.log(ind);
    if(ind <= -1) {
        res.status(404).json({});
    }
    else {
        notes.splice(ind, 1);
        // console.log(notes);
        res.status(302).json({});
    }

    // console.log(notes)


})

app.post('/api/persons', (req, res) => {
    console.log(req);

    if(req.body === undefined) {
        return res.status(418).json({error: 'no content'});
    }

    const payload = req.body;
    console.log(payload);
    try {
        const person = {
                name: payload.name,
                number: payload.number,
                id: Math.floor(Math.random()) * 1000000
        }
        persons.push(person);
        return res.status(200).json({});

    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

