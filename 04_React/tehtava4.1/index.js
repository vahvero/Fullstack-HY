const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
});

module.exports = Blog;

app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.NODE_ENV !== 'production' ? process.env.DEV_URL : process.env.PROD_URL;
console.log(mongoUrl);
mongoose.connect(mongoUrl, { useNewUrlParser: true } );

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs);
        });
});

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body);

    blog
        .save()
        .then(result => {
            response.status(201).json(result);
        });
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});