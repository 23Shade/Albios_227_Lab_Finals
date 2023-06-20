const express = require('express');
const router = express.Router();

// Middleware to validate user
const validateUser = (req, res, next) => {
  // Check if user is authenticated
  const isAuthenticated = true; // Assuming the user is authenticated

  if (isAuthenticated) {
    req.user = { id: 1, name: 'John', isAdmin: true }; // Sample user data
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // Check if the authenticated user is an admin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

router.get('/', (req, res) => {
  res.send('User routes');
});

// Export the router
module.exports = router;
