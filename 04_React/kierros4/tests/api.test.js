const supertest = require('supertest');
const {app, server} = require('../index');
const {Blog, z} = require('../models/blog');
const testBlogs = require('./testBlogs').blogs;
const {blogsInDb, nonExistingId} = require('./testHelper');

const api = supertest(app);


test('Blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('Blogs length is correct', async () => {
    const len = testBlogs.length;
    const blogs = await blogsInDb();
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
    //Remove the added blog
    await Blog.remove({intBlog});

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

    expect(content == undefined).toBe(false);

    expect(content.likes == undefined).toBe(false);

    expect(content.likes).toBe(0);
    // Remove the added blog
    await Blog.remove(partFailBlog);

});

test('Test invalid url and invalid title blogs', async () => {

    const blogs_ = blogsInDb();
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

    const getBlogs = blogsInDb();

    const len2 = getBlogs.length;

    expect(len1).toEqual(len2);

});

test('Test singular delete', async () => {
    
    const additionBlog = {
        title: 'ValidBlogTest',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
        likes: 10,
    };

    const createBlog = new Blog(additionBlog);

    await createBlog.save();

    // Deletion
    await api
        .delete('/api/blogs/' + createBlog._id)
        .expect(200);

});

test('Test invalid id delete', async () => {
    const invalidId = nonExistingId();

    await api
        .delete('/api/blogs/' + invalidId)
        .expect(404);
});

test('Test valid put', async () => {
    const replaceTitle = 'TestPutTitle';
    const testBlog = new Blog();
    await testBlog.save();

    await api
        .put('/api/blogs/' + testBlog._id)
        .send({
            title: replaceTitle,
        })
        .expect(200);

    const blogs = await blogsInDb();
    
    const found = blogs.find((elem) => {
        return elem.title === replaceTitle;
    });

    let compareBlog = testBlog;
    compareBlog.title = replaceTitle;

    expect(found).toEqual(Blog.format(compareBlog));

    await Blog.remove({_id: testBlog._id});
});

test('Test invalid put', async () => {
    const invalidId = nonExistingId();

    const replaceTitle = 'TestInvalidIdPutTitle';

    await api
        .put('/api/blogs/' + invalidId)
        .send({
            title: replaceTitle,
        })
        .expect(404);

});

// Reset the database
beforeAll(async () => {
    await Blog.remove({});
    const blogObjects = testBlogs.map(elem => new Blog(elem));
    const promises = blogObjects.map(blog => blog.save());
    await Promise.all(promises);

});

//Close the server connection
afterAll(() => {
    server.close();
});