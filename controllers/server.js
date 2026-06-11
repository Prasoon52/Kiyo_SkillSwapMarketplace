// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
const messageRoutes = require('../models/routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// Initialize Socket.io
const setupSocket = require('../socket/index');
setupSocket(server);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kiyo_marketplace';

// Prevent connecting to the real database when running tests
if (process.env.NODE_ENV !== 'test') {
mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Export app for testing purposes
module.exports = app;