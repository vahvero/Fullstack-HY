const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogRouter');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/blogs', blogRouter);

const mongoUrl = process.env.NODE_ENV !== 'production' ? process.env.DEV_URL : process.env.PROD_URL;

// console.log(mongoUrl);

mongoose
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected.');
    })
    .catch( e => {
        console.log(e);
        return;
    });

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});