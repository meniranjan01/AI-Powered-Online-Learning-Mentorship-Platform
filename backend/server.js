const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI-Powered Learning Platform API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User routes
app.use('/api/users', usersRoute);
// Course routes
app.use('/api/courses', coursesRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;