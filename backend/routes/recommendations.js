const express = require('express');
const router = express.Router();
const { UserCourse, Course, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get course recommendations for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's enrolled courses
    const userCourses = await UserCourse.findAll({
      where: { userId: userId },
      include: [{
        model: Course,
        as: 'course'
      }]
    });

    // Get all courses
    const allCourses = await Course.findAll();

    // Simple recommendation algorithm:
    // 1. Recommend courses similar to ones user has high progress in
    // 2. Recommend popular courses among users with similar interests
    // 3. Recommend courses user hasn't enrolled in yet

    // For now, we'll implement a simple version:
    // Recommend courses that the user hasn't enrolled in yet
    const enrolledCourseIds = userCourses.map(uc => uc.course.id);
    const recommendedCourses = allCourses.filter(course =>
      !enrolledCourseIds.includes(course.id)
    );

    // Limit to top 5 recommendations
    const limitedRecommendations = recommendedCourses.slice(0, 5);

    res.json({
      recommendations: limitedRecommendations,
      count: limitedRecommendations.length
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations based on course category/tags (placeholder for future enhancement)
router.get('/by-category/:category', authenticateToken, async (req, res) => {
  try {
    // This would be enhanced with actual course categorization/tagging
    res.json({ message: 'Category-based recommendations coming soon' });
  } catch (error) {
    console.error('Get category recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;