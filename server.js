require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();
const port = 3000;

app.use(express.json());

app.use(morgan('dev'));

// define schema and map to movies 
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
});

// mapping to specific collection
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// connecting, some debug logs
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// helper function
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

app.get('/', async (req, res) => {
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
    res.status(500).json({ error: 'Error retrieving movies from db', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});

// GET /movies with query parameters
app.get('/movies', async (req, res) => {
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
    res.status(500).json({ error: 'Error retrieving movies from the database' });
  }
});



// adding new movie
app.post('/movies', async (req, res) => {
  // add error catching
  try {
    const { title, director, year } = req.body;

    const validationError = validateMovieData(title, director, year);

    if (validationError) {
      return res.status(400).json({ status: 400, message: validationError });
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
});

// get movie by id
app.get('/movies/:id', async (req, res) => {
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
});

// deleting movie by id
app.delete('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    // check if movie exists
    if (!movie) {
      return res.status(404).json({ status: 404, message: 'Movie not found' });
    }
    // delete in db
    await Movie.findByIdAndDelete(movieId);

    res.status(200).json({ status: 200, 
      message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error',
      error: error.message });
  }
});

// update a movie by ID
app.put('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const { title, director, year } = req.body;
    // validate data
    const validationError = validateMovieData(title, director, year);
    if (validationError) {
      return res.status(400).json({ status: 400, message: validationError });
    }
    // $set prevents overwriting other fields 
    // that are not included in the request
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { $set: {title, director, year}},
      { new: true, runValidators: true}
    );
    
    if (!updatedMovie) {
      return res.status(404).json({ status: 404, message: 'Movie not found' });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie',
       error: error.message });
  }
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});
