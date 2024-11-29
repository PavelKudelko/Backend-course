const Joi = require('joi');
const Movie = require('../models/movie');

const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
});

const validateMovie = async (req, res, next) => {
    // Validate input with Joi
    const { error } = movieSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateMovie };