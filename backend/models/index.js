const User = require('./user');
const Course = require('./course');
const LearningGoal = require('./learningGoal');

// Associate models if needed
LearningGoal.associate = (models) => {
  LearningGoal.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = {
  User,
  Course,
  LearningGoal
};