const Movie = require('../models/movie');
const { validateMovieData } = require('../utils/validate');

const getAllMoviesJSON = async(req, res) => {
    try {
        // fetch from mongoDB
        const movie = await Movie.find(); 
        if (movie) {
          res.json(movie);  
        } else {
          res.status(404).json({ error: 'No movies found' });
        }
    } catch (error) {
        console.error('Error retrieving movie:', error);
        res.status(500).json({ error: 'Error retrieving movies from db', 
            details: error.message });
    }
}

const getAllMovies = async(req, res) => {
    const { title, year, director } = req.query;

    // Build the query object
    let query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (year) query.year = parseInt(year); 
    if (director) query.director = { $regex: director, $options: 'i' };
  
    try {
      // Fetch filtered movies from MongoDB
      const filteredMovies = await Movie.find(query);
  
      // Map movies to an HTML list
      const movieList = filteredMovies.map(movie =>
        `<li>${movie.title} (${movie.year}), directed by ${movie.director}</li>`
      ).join('');
  
      res.send(`<h1>Movie list</h1><ul>${movieList}</ul>`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 
        'Error retrieving movies from the database' });
    }
}

const postMovie = async(req, res) => {
    // add error catching
    try {
        const { title, director, year } = req.body;

        const validationError = validateMovieData(title, director, year);

        if (validationError) {
            return res.status(400).json({ status: 400,
                 message: validationError });
        }
        // create movie object
        const newMovie = new Movie({ title, director, year });

        // save in db
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add movie',
        error: error.message });
    }
}

const getMovieById = async(req, res) => {
    // add error catching
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);

        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ status: 404, message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error',
        error: error.message });
    }
}

const deleteMovieById = async(req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        // check if movie exists
        if (!movie) {
          return res.status(404).json({ status: 404,
             message: 'Movie not found' });
        }
        // delete in db
        await Movie.findByIdAndDelete(movieId);
    
        res.status(200).json({ status: 200, 
        message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error',
        error: error.message });
    }
}

const updateMovieById = async (req, res) => {
    try {
    const movieId = req.params.id;
        const { title, director, year } = req.body;
        // validate data
        const validationError = validateMovieData(title, director, year);
        if (validationError) {
          return res.status(400).json({ status: 400,
             message: validationError });
        }
        // $set prevents overwriting other fields 
        // that are not included in the request
        const updatedMovie = await Movie.findByIdAndUpdate(
          movieId,
          { $set: {title, director, year}},
          { new: true, runValidators: true}
        );
        
        if (!updatedMovie) {
          return res.status(404).json({ status: 404, 
            message: 'Movie not found' });
        }
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update movie',
            error: error.message });
    }
}

module.exports = {
    getAllMoviesJSON,
    getAllMovies, 
    postMovie,
    getMovieById,
    deleteMovieById,
    updateMovieById
};