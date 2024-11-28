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

// Routes
router.get('/json', getAllMoviesJSON);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', postMovie);
router.put('/:id', updateMovieById);
router.delete('/:id', deleteMovieById);

module.exports = router;
