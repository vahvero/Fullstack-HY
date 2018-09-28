
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
    if(!ind) {
        res.status(404);
    }
    else {
        notes.splice(ind, 1);
        res.status(302);
    }

    


})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

