const express = require('express');
const router = express.Router();

// Mock course data
let courses = [
  { id: 1, title: 'Introduction to AI', description: 'Learn the basics of Artificial Intelligence', instructor: 'Dr. AI Expert', duration: '4 weeks' },
  { id: 2, title: 'Web Development Fundamentals', description: 'HTML, CSS, and JavaScript for beginners', instructor: 'Web Dev Master', duration: '6 weeks' }
];

// Get all courses
router.get('/', (req, res) => {
  res.json(courses);
});

// Get course by ID
router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// Create new course
router.post('/', (req, res) => {
  const { title, description, instructor, duration } = req.body;
  const newCourse = {
    id: courses.length + 1,
    title,
    description,
    instructor,
    duration
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

module.exports = router;