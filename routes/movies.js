const express = require('express');
const router = express.Router();

const {
  getAllMoviesJSON,
  getAllMovies, 
  postMovie,
  getMovieById,
  deleteMovieById,
  updateMovieById
} = require('../controllers/moviesController');

const { validateMovie } = require('../middleware/validateMovie');

// Routes
router.get('/json', getAllMoviesJSON);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', validateMovie, postMovie);
router.put('/:id', validateMovie, updateMovieById);
router.delete('/:id', deleteMovieById);

module.exports = router;
