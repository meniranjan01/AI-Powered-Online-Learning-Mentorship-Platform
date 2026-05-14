const express = require('express');
const router = express.Router();
const { UserCourse, User, Course } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all user courses for current user (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userCourses = await UserCourse.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Course,
        as: 'course'
      }]
    });
    res.json(userCourses);
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user course by ID (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userCourse = await UserCourse.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{
        model: Course,
        as: 'course'
      }]
    });

    if (!userCourse) {
      return res.status(404).json({ message: 'User course not found' });
    }
    res.json(userCourse);
  } catch (error) {
    console.error('Get user course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user course (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    // Validate input
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already enrolled in this course
    const existingUserCourse = await UserCourse.findOne({
      where: { userId: req.user.id, courseId: courseId }
    });
    if (existingUserCourse) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Create user course
    const userCourse = await UserCourse.create({
      userId: req.user.id,
      courseId: courseId,
      progress: progress || 0
    });

    // Fetch the created user course with course data included
    const userCourseWithCourse = await UserCourse.findByPk(userCourse.id, {
      include: [{
        model: Course,
        as: 'course'
      }]
    });

    res.status(201).json({
      message: 'User course created successfully',
      userCourse: userCourseWithCourse
    });
  } catch (error) {
    console.error('Create user course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user course (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { progress, completed } = req.body;
    const userCourse = await UserCourse.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!userCourse) {
      return res.status(404).json({ message: 'User course not found' });
    }

    // Update fields if provided
    if (progress !== undefined) {
      if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0 and 100' });
      }
      userCourse.progress = progress;
    }
    if (completed !== undefined) userCourse.completed = completed;

    await userCourse.save();
    res.json({ message: 'User course updated successfully', userCourse });
  } catch (error) {
    console.error('Update user course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user course (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userCourse = await UserCourse.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!userCourse) {
      return res.status(404).json({ message: 'User course not found' });
    }

    res.json({ message: 'User course deleted successfully' });
  } catch (error) {
    console.error('Delete user course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;