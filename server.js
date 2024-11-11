const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// JSON array from assignment
const movies = [
     { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 }, 
     { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 }, 
     { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 } 
    ];

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

app.get('/', (req, res) => {
    res.send(movies)
});

// New implementation, returns simple html with movie list
app.get('/movies', (req, res) => {
    const movieList = movies.map(movie => 
        `<li>${movie.title} (${movie.year}), 
        directed by ${movie.director}</li>`).join('');

    res.send(`<h1>Movie list</h1><ul>${movieList}</ul>`);
  });

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});

// adding new movie
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body;

  const validationError = validateMovieData(title, director, year);

  if (validationError) {
    return res.status(400).json({ status: 400, message: validationError });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    director,
    year
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// get movie by id
app.get('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ status: 404, message: 'Movie not found' });
  }
});

// deleting movie by id
app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);
  
    if (movieIndex === -1) {
      return res.status(404).json({ status: 404, message: 'Movie not found' });
    }
  
    movies.splice(movieIndex, 1);
    res.status(204).send(); 
});

// update a movie by ID
app.put('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const { title, director, year } = req.body;
  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ status: 404, message: 'Movie not found' });
  }

  if ((year && (typeof year !== 'number' ||
     year < 1888 || year > new Date().getFullYear()))) {
    return res.status(400).json({
       status: 400, message: 
       'Year must be a valid number between 1888 and the current year.'
      });
  }

  if (title) movie.title = title;
  if (director) movie.director = director;
  if (year) movie.year = year;

  res.json(movie);
});