const User = require('./user');
const Course = require('./course');
const LearningGoal = require('./learningGoal');
const UserCourse = require('./userCourse');

// Create models object
const models = {
  User,
  Course,
  LearningGoal,
  UserCourse
};

// Call associate functions
if (LearningGoal.associate) {
  LearningGoal.associate(models);
}

if (UserCourse.associate) {
  UserCourse.associate(models);
}

module.exports = {
  User,
  Course,
  LearningGoal,
  UserCourse
};