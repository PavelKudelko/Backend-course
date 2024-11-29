require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movieRoutes = require('./routes/movies');
const connectDB = require('./config/db.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));

// connect to DB
const run_server = async() => {
  await connectDB();

  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  });
};

run_server();

// Routes
app.use('/movies', movieRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});
