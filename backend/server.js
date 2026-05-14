const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');
const authRoute = require('./routes/auth');
const learningGoalsRoute = require('./routes/learningGoals');
const userCourseRoute = require('./routes/userCourse');
const recommendationsRoute = require('./routes/recommendations');
const analyticsRoute = require('./routes/analytics');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    // Sync all models
    return sequelize.sync();
  })
  .then(() => {
    console.log('All models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI-Powered Learning Platform API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoute);

// User routes
app.use('/api/users', usersRoute);

// Course routes
app.use('/api/courses', coursesRoute);

// Learning goals routes
app.use('/api/learning-goals', learningGoalsRoute);

// User course routes
app.use('/api/user-courses', userCourseRoute);

// Recommendations routes
app.use('/api/recommendations', recommendationsRoute);

// Analytics routes
app.use('/api/analytics', analyticsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;