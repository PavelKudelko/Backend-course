require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db.js');
// ws part
const http = require('http');
const WebSocket = require('ws');
const { initializeWebSocket } = require('./wsHandler');
// https
const selfsigned = require('selfsigned');
const https = require('https');

const app = express();
//const port = 3000;
// new port
HTTPS_PORT = 3443;
// handling websocket
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });
initializeWebSocket(wsServer);

app.use(express.json());
app.use(morgan('dev'));

// https part
const attrs = { name: 'commonName', value: 'localhost' };
const options = { days: 365 }; // Certificate validity
const { private: privateKey, cert: certificate } = selfsigned.generate(attrs, options);

 
// HTTPS server options
const sslOptions = {
    key: privateKey,
    cert: certificate,
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app)

// connect to DB
const run_server = async() => {
  await connectDB();

  // connect to server (app previously)
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`app listening on port ${HTTPS_PORT}`)
    console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
  });
};

run_server();

// Routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});
