const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'mentor', 'instructor', 'admin'),
    allowNull: false,
    defaultValue: 'student'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON, // Store as JSON array
    allowNull: true,
    defaultValue: []
  },
  interests: {
    type: DataTypes.JSON, // Store as JSON array
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Instance method to get user without password
User.prototype.getPublicProfile = function() {
  const { id, name, email, role, bio, skills, interests, createdAt, updatedAt } = this;
  return { id, name, email, role, bio, skills, interests, createdAt, updatedAt };
};

module.exports = User;