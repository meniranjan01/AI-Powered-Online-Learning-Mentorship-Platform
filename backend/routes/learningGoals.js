const express = require('express');
const router = express.Router();
const { LearningGoal, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all learning goals for current user (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const goals = await LearningGoal.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(goals);
  } catch (error) {
    console.error('Get learning goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new learning goal (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create learning goal
    const goal = await LearningGoal.create({
      userId: req.user.id,
      title,
      description: description || '',
      targetDate: targetDate || null
    });

    res.status(201).json({
      message: 'Learning goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create learning goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update learning goal (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, targetDate, completed, progress } = req.body;
    const goal = await LearningGoal.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Learning goal not found' });
    }

    // Update fields if provided
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (completed !== undefined) goal.completed = completed;
    if (progress !== undefined) {
      if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0 and 100' });
      }
      goal.progress = progress;
    }

    await goal.save();
    res.json({
      message: 'Learning goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update learning goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete learning goal (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await LearningGoal.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Learning goal not found' });
    }

    res.json({ message: 'Learning goal deleted successfully' });
  } catch (error) {
    console.error('Delete learning goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update learning goal progress (protected)
router.patch('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({ message: 'Progress is required' });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const goal = await LearningGoal.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Learning goal not found' });
    }

    goal.progress = progress;
    // Automatically mark as completed if progress is 100%
    if (progress === 100) {
      goal.completed = true;
    } else if (goal.completed && progress < 100) {
      goal.completed = false;
    }

    await goal.save();
    res.json({
      message: 'Learning goal progress updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update learning goal progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;