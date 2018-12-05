const supertest = require('supertest');
const {app, server} = require('../index');
const {Blog} = require('../models/blog');
const testBlogs = require('./testBlogs').blogs;
const {User} = require('../models/user');
const {blogsInDb, nonExistingId, generateUser} = require('./testHelper');

const api = supertest(app);

// Reset the database
beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const user = await generateUser();
    const blogObjects = testBlogs.map(elem => {
        elem.user = user.id;
        return new Blog(elem);
    });
    const promises = blogObjects.map(blog => blog.save());
    await Promise.all(promises);

});

//Close the server connection
afterAll(() => {
    server.close();
});


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

    const testUser = await generateUser();

    // console.log('Test user: ' + JSON.stringify(testUser));
    // console.log(testUser.id);
    expect(testUser.id).toBeDefined();

    const intBlog = {
        title: 'NewPostTestTitle',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
        likes: 66,
        user: testUser.id,
    };

    await api.post('/api/blogs')
        .send(intBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titleContent = response.body.map(x => x.title);
    
    const addedBlog = await Blog.findOne({title: intBlog.title});

    const userBlogs = await User.findById(testUser.id);
    expect(userBlogs.blogs).toBeDefined();

    // console.log(userBlogs);

    expect(response.body.length).toBe(testBlogs.length + 1);
    expect(titleContent).toContain(intBlog.title);
    expect(userBlogs.blogs).toContain(addedBlog._id);

    //Remove the added blog
    await Blog.deleteOne({intBlog});
    await User.deleteOne({testUser});

});


test('Test invalid likes blog', async () => {

    const testUser = await generateUser(); 
    expect(testUser.id).toBeDefined();

    const partFailBlog = {
        title: 'NewInvalidLikesTestTitle',
        author: 'JohnyCäshbä',
        url: 'https://lolpatterns.com/',
        user: testUser.id,
    };

    await api.post('/api/blogs')
        .send(partFailBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const resp = await api.get('/api/blogs');

    const content = resp.body.find((elem) => {
        return elem.title === partFailBlog.title;
    });

    const addedBlog = await Blog.findOne({title: partFailBlog.title});

    const userBlogs = await User.findById(testUser.id);
    expect(userBlogs.blogs).toBeDefined();

    expect(content == undefined).toBe(false);
    expect(content.likes == undefined).toBe(false);
    expect(content.likes).toBe(0);
    expect(userBlogs.blogs).toContain(addedBlog._id);


    // Remove the added blog
    await Blog.remove(partFailBlog);
    await User.findByIdAndDelete(testUser.id);
});


test('Test invalid url and invalid title blogs', async () => {

    const testUser = await generateUser();

    expect(testUser.id).toBeDefined();

    const len1 = await blogsInDb().length;

    let failBlog = {
        title: 'NewInvalidUrlTitle',
        author: 'JohnyCäshbä',
        // url: 'https://lolpatterns.com/',
        likes: 10,
        user: testUser.id
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

    await User.deleteOne({testUser});

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