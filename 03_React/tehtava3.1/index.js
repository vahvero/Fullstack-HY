
const {Person, formatPerson}  = require('./db');

const express = require('express');

const app = express();

const bodyparser = require('body-parser');

app.use(bodyparser.json());

const morgan = require('morgan');

const cors = require('cors');

app.use(express.static('build'));

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
            
        ].join(' ');
    }

));

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(
            response => {
                // console.log(response);
                res.json(
                    response.map(
                        (elem) => {
                            return formatPerson(elem);
                        }
                    )
                );
            }
            //     console.log(response);
            //     response.forEach(
            //         person => {
            //             console.log(person);
            //             return person;
            //         }
            //     )
            // }
        )
        // .then(
        //     response => {
        //         console.log("Perkele: " + response);
        //         if (!response){
        //             console.log('VITTU')
        //             res.json({})
        //         }
        //         else{
        //             res.json(response);
        //         }
        //     }
        // )
        .catch(() => {
            // console.log(err);
            res.status(400).json({});
        });

});

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(
            response => {
                const len = response.length;
                const time = new Date();
                res.send(
                    `<p>Puhelin luettelossa on ${len} numeroa.</p>
                    <p>${time}</p>`
                );
            }
        );
});

app.get('/api/persons/:id', (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    Person.find(
        {_id: id}
    )
        .then(
            (person) => {
                if(!person){
                    res.status(404).json(person);
                }
                else {
                    res.json(person);
                }
            }
        );
});

app.delete('/api/persons/:id', (req, res) => {

    // console.log('Reg.params' + JSON.stringify(req.params));
    const id = req.params.id;

    Person.findByIdAndDelete(
        id
    ).then(
        resp => {
            // console.log('RESP ' + resp);
            if(!resp){
                res.status(404).json({});
            }
            else{
                // console.log('Deleted.');
                res.status(200).json({});
            }
        }
    )
        .catch(err => {
        // console.log(err);
            res.status(400).json({});
        });

});

app.post('/api/persons', (req, res) => {
    // console.log(req);

    if(req.body === undefined) {
        return res.status(418).json({error: 'no content'});
    }

    const payload = req.body;
    // console.log(payload);

    Person.find(
        {name: payload.name}
    )
        .then(
            // response => {
            //     // console.log(response);
            // }
        );

    Person.find(
        {name: payload.name}
    )
        .then( 
            response => {

                if(!response || payload.number === '')
                {
                    return res.status(418).json(
                        {error: 'Name must be unique and number non empty'}     
                    );
                }
                try {
                    Person.create({
                        name: payload.name,
                        number: payload.number,
                        id: Math.floor(Math.random() * 1000000)
                    }
                    ,() => {
                        // console.log(err);
                    });

                    return res.status(200).json({
                        name: payload.name,
                        number: payload.number,
                    });

                }
                catch(e) {
                    // console.log(e);
                    return res.status(400).json({error: e});
                }
            }
        );
});


app.put('/api/persons/:id', (req, res) => {
    // console.log('Reg.params' + JSON.stringify(req.params));
    // console.log(req.body);

    const id = req.params.id;
    const payload = req.body;
    Person.findByIdAndUpdate(
        id,
        payload,
        {new: true},
        (err, todo) => {
            if(err) return res.status(500).send(err);
            return res.send(todo);
        }
    )
        .then(
            (resp) => {
                res.json(resp);
            }
        )
        .catch(
            (e) => {
                // console.log(e);
                res.status(418);
            }
        );
});
const localPORT = 3001;

const PORT = process.env.PORT || localPORT;
app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
});

