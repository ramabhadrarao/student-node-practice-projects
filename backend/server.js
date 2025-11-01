// Simple Express server with MongoDB connection and basic auth routes
// This file is the entry point of the backend.

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

const app = express();

// Basic middleware
// CORS allows our React frontend (localhost:3000) to talk to this backend
app.use(cors());
// Parse incoming JSON bodies
app.use(express.json());

// Serve static files from the "public" directory (e.g., docs HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB using Mongoose
// Make sure you set MONGO_URI in your .env file
const MONGO_URI = process.env.MONGO_URI || '';
mongoose
  .connect(MONGO_URI, { dbName: 'student_auth_demo' })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Simple health route
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'API is running' });
});

// Auth routes (register, login, me)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});