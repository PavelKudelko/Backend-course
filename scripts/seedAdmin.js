const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();
 
const seedAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI );
        console.log('Database connected.');
 
        await User.create({
            username: 'admin',
            password: 'admin123', // Hashing can be added later
            role: 'admin',
        });
        console.log('Admin user created!');
    } catch (err) {
        console.error('Error creating admin user:', err.message);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
};
 
seedAdmin();