const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

// Login logic
const login = async (req, res) => {
    const { username, password } = req.body;
    try {    
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // use bcrypt to validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // Validate password
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async(req, res) => {
    const { username, password, role } = req.body;
    try {
        const userExists = await User.findOne({username});
        if (userExists) {
            return res.status(400).json({error: 'User already in db'});
        }
        // create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, password: hashedPassword, role});
        await user.save();
        
        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = { login, register };