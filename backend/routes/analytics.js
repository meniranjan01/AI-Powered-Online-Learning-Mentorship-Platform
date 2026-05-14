const express = require('express');
const router = express.Router();
const { UserCourse } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get learning progress analytics for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user courses for the current user
    const userCourses = await UserCourse.findAll({
      where: { userId: userId }
    });

    if (userCourses.length === 0) {
      return res.json({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        averageProgress: 0,
        progressDistribution: {
          '0-25': 0,
          '26-50': 0,
          '51-75': 0,
          '76-100': 0
        }
      });
    }

    const totalCourses = userCourses.length;
    const completedCourses = userCourses.filter(uc => uc.completed).length;
    const inProgressCourses = totalCourses - completedCourses;

    // Calculate average progress
    const totalProgress = userCourses.reduce((sum, uc) => sum + uc.progress, 0);
    const averageProgress = Math.round((totalProgress / totalCourses) * 100) / 100; // Round to 2 decimal places

    // Calculate progress distribution
    const progressDistribution = {
      '0-25': 0,
      '26-50': 0,
      '51-75': 0,
      '76-100': 0
    };

    userCourses.forEach(uc => {
      const progress = uc.progress;
      if (progress >= 0 && progress <= 25) {
        progressDistribution['0-25']++;
      } else if (progress >= 26 && progress <= 50) {
        progressDistribution['26-50']++;
      } else if (progress >= 51 && progress <= 75) {
        progressDistribution['51-75']++;
      } else if (progress >= 76 && progress <= 100) {
        progressDistribution['76-100']++;
      }
    });

    res.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
      progressDistribution
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;