const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCourse = sequelize.define('UserCourse', {
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
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  progress: {
    type: DataTypes.INTEGER, // Percentage 0-100
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'user_courses',
  timestamps: true
});

// Add associations
UserCourse.associate = (models) => {
  UserCourse.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  UserCourse.belongsTo(models.Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
};

module.exports = UserCourse;