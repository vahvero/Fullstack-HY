

const listFunctions = require('../utils/listFunctions');

const filterArray = listFunctions.filterArray;
const totalLikes = listFunctions.totalLikes;
const favoriteBlog = listFunctions.favoriteBlog;
const mostBlogs = listFunctions.mostBlogs; 
const mostLikes = listFunctions.mostLikes;

var testArray = new Array();

const testBlogs = require('./testBlogs').blogs;

for(var i=0;i<5;++i) {
    testArray.push({
        title: 'title' + i,
        author: 'author' + i,
        url: 'url' + i,
        likes: i,
    });
}

test('Test filter array with title as param.', () => {
    const res = filterArray('title1', testArray, 'title');
    const exp = [{
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 1,
    }];
    expect(res).toEqual(exp);
});

test('Test filter with no matches.', () => {
    const res = filterArray('title6', testArray, 'title');
    const exp = [];

    expect(res).toEqual(exp);
});

test('Test totalLikes', () => {
    const res = totalLikes(testArray);
    // Test array should be 0 1 2 3 4 likes. 
    const exp = 1 + 2 + 3 + 4;

    expect(res).toEqual(exp);
});

test('Test favoriteBlog', () => {
    const res = favoriteBlog(testArray);
    const exp = {
        title: 'title4',
        author: 'author4',
        url: 'url4',
        likes: 4
    };

    expect(res).toEqual(exp);
});

test('Test favoriteBlog2', () => {
    
    const res = favoriteBlog(testBlogs);
    const exp = {
        __v: 0,
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    };
    expect(res).toEqual(exp);
});

test('Test most blogs', () => {
    const res = mostBlogs(testBlogs);
    const exp = {
        author: 'Robert C. Martin',
        blogs: 3,
    };

    expect(res).toEqual(exp);
});

test('Test most likes', () => {
    const res = mostLikes(testBlogs);
    const exp = {
        author: 'Edsger W. Dijkstra',
        likes: 17,
    };

    expect(res).toEqual(exp);
});
