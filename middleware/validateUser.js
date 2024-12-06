const Joi = require('joi');
const User = require('../models/user');

const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('admin', 'regular').required()
});

// validate user middleware
const validateUser = async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateUser };
