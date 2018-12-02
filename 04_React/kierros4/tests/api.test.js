const supertest = require('supertest');
const {app, server} = require('../index');
const {Blog} = require('../models/blog');
const testBlogs = require('./testBlogs').blogs;

const api = supertest(app);


test('Blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('Blogs length is correct', async () => {
    const len = testBlogs.length;
    const blogs = await Blog.find({});
    expect(blogs.length).toEqual(len);
});

test('Test blog post addition', async () => {
    const intBlog = {
        title: 'NewPostTestTitle',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
        likes: 66,
    };

    await api.post('/api/blogs')
        .send(intBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const content = response.body.map(x => x.title);

    expect(response.body.length).toBe(testBlogs.length + 1);
    expect(content).toContain(intBlog.title);
});

test('Test invalid likes blog', async () => {
    const partFailBlog = {
        title: 'NewInvalidLikesTestTitle',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
    };

    await api.post('/api/blogs')
        .send(partFailBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const resp = await api.get('/api/blogs');

    const content = resp.body.find((elem) => {
        return elem.title === partFailBlog.title;
    });

    // console.log(content);
    expect(content == undefined).toBe(false);

    // expect(content).toEqual({
    //     title: 'NewInvalidPostTestTitle',
    //     author: 'JohnyCäshbä',
    //     url: 'https://lolpatterns.com/',
    //     likes: 0,
    // });

    expect(content.likes == undefined).toBe(false);

    expect(content.likes).toBe(0);
});

test('Test invalid url and invalid title blogs', async () => {

    const blogs_ = await api.get('/api/blogs');
    const len1 = blogs_.length;

    let failBlog = {
        title: 'NewInvalidUrlTitle',
        author: 'JohnyCäshbä',
        // url: 'https://lolpatterns.com/',
        likes: 10,
    };

    await api.post('/api/blogs')
        .send(failBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    failBlog = {
        // title: 'NewInvalidUrlTitle',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
        likes: 10,
    };

    await api.post('/api/blogs')
        .send(failBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    const getBlogs = await api.get('/api/blogs');

    const len2 = getBlogs.length;

    expect(len1).toEqual(len2);

});

beforeAll(async () => {
    await Blog.remove({});
    const blogObjects = testBlogs.map(elem => new Blog(elem));
    const promises = blogObjects.map(blog => blog.save());
    await Promise.all(promises);

});

afterAll(() => {
    server.close();
});