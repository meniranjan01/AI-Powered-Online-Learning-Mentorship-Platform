const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with SQLite (for development)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;