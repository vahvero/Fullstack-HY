
const express = require('express');

const app = express();

const bodyparser = require('body-parser');

app.use(bodyparser.json());

const morgan = require('morgan');

const cors = require('cors');

app.use(cors());

app.use(morgan(

    (tokens, req, res) => {
        // console.log(req.body, res);
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            JSON.stringify(req.body),
            JSON.stringify(res.body),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            
        ].join(' ')
    }

));

const port = 3001;

let persons = [
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
    res.json(persons)
})

app.get('/info', (req, res) => {
    const len = persons.length;
    const time = new Date();
    res.send(
        `<p>Puhelin luettelossa on ${len} numeroa.</p>
        <p>${time}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = persons.find((elem) => {
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
    const ind = persons.findIndex(
        (elem) => {
            return elem.id === id;
        }
    )
    console.log(ind);
    if(ind <= -1) {
        res.status(404).json({});
    }
    else {
        persons.splice(ind, 1);
        // console.log(persons);
        res.status(302).json({});
    }

    // console.log(persons)


})

app.post('/api/persons', (req, res) => {
    // console.log(req);

    if(req.body === undefined) {
        return res.status(418).json({error: 'no content'});
    }

    const payload = req.body;
    console.log(payload);

    console.log(persons.find((elem => {
        return elem.name === payload.name
    })) || !isNaN(payload.number));

    if(persons.find((elem => {
        return elem.name === payload.name
    })) || payload.number === ""
    ){
        return res.status(418).json(
            {error: 'Name must be unique and number non empty'}     
        );
    }
    try {
        const person = {
                name: payload.name,
                number: payload.number,
                id: Math.floor(Math.random() * 1000000)
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

const PORT = process.env.PORT || PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

