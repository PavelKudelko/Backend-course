const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

const { validateUser } = require('../middleware/validateUser');

// Login route
router.post('/login', login);
router.post('/register', validateUser, register);

module.exports = router;