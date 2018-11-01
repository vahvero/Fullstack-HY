


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
    )
}

module.exports = {filterArray, totalLikes, favoriteBlog};