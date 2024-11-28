const validateMovieData = (title, director, year) => {
    if (!title || !director || !year) {
      return 'Title, director, and year are required.';
    }
    if (typeof year !== 'number' || year < 1888 
      || year > new Date().getFullYear()) {
      return 'Year must be a valid number between 1888 and the current year.';
    }
    return null;
};

module.exports = { validateMovieData };
