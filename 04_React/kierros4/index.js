const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogRouter');
const {userRouter} = require('./controllers/userRouter');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

const mongoUrl = process.env.NODE_ENV !== 'production' ? 
    process.env.DEV_URL : process.env.PROD_URL;

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

const PORT = process.env.NODE_ENV === 'test' ? 0 : 3003;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = {app, server};