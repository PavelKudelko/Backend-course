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
const { authenticate } = require('../middleware/authenticate');

// Routes
router.get('/json', getAllMoviesJSON);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', authenticate, validateMovie, postMovie);
router.put('/:id', authenticate, validateMovie, updateMovieById);
router.delete('/:id', authenticate, deleteMovieById);

module.exports = router;
