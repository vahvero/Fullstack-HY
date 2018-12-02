


const filterArray = (name, array, parameter = 'title') => {
    return array.filter(
        elem => elem[parameter] === name
    );
};

const totalLikes = (array) => {
    return array.reduce((prev,elem) => prev + elem.likes, 0);
};

const favoriteBlog = (blogs) => {
    return blogs.reduce( (prev, elem) => {
        return prev.likes < elem.likes ?  elem : prev;
    }
    );
};

// Inefficient but works
const mostBlogs = (blogs) => {
    var authors = {};

    for(let blog of blogs) {
        if(!authors[blog.author]){
            authors[blog.author] = 1;
        }
        else {
            authors[blog.author] += 1;
        }
    }

    var ret = {
        author: '',
        blogs: 0
    };

    for(let key of Object.keys(authors)) {
        if(authors[key] > ret.blogs) {
            ret.author = key;
            ret.blogs  = authors[key];
        }
    }

    return ret;
}; 

const mostLikes = (blogs) => {
    var authors = {};
    for(let blog of blogs) {
        if(!authors[blog.author]){
            authors[blog.author] = blog.likes;
        }
        else {
            authors[blog.author] += blog.likes;
        }
    }

    var ret = {
        author: '',
        likes: Number.NEGATIVE_INFINITY
    };

    for(let key of Object.keys(authors)) {
        if(authors[key] > ret.likes) {
            ret.author = key;
            ret.likes  = authors[key];
        }
    }  
    return ret;
};

module.exports = {
    filterArray, 
    totalLikes, 
    favoriteBlog, 
    mostBlogs,
    mostLikes,
};