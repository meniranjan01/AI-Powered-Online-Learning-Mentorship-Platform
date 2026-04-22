const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningGoal = sequelize.define('LearningGoal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  progress: {
    type: DataTypes.INTEGER, // Percentage 0-100
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'learning_goals',
  timestamps: true
});

// Add association
LearningGoal.associate = (models) => {
  LearningGoal.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = LearningGoal;