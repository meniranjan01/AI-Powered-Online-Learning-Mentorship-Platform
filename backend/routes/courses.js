const express = require('express');
const router = express.Router();
const { Course } = require('../models');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new course
router.post('/', async (req, res) => {
  try {
    const { title, description, instructor, duration } = req.body;

    // Validate input
    if (!title || !description || !instructor || !duration) {
      return res.status(400).json({ message: 'Title, description, instructor, and duration are required' });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      instructor,
      duration
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const { title, description, instructor, duration } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields if provided
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (instructor !== undefined) course.instructor = instructor;
    if (duration !== undefined) course.duration = duration;

    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;