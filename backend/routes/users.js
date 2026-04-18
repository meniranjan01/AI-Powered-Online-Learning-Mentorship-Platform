const express = require('express');
const router = express.Router();

// Mock user data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'mentor' }
];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Create new user
router.post('/', (req, res) => {
  const { name, email, role } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;