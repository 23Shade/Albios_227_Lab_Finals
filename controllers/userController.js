// controllers/userController.js
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    // Implementation for user registration
    const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    // Implementation for user authentication/verification
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a token or session for authentication
    const token = generateAuthToken(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.setAdmin = async (req, res) => {
  try {
    // Implementation for setting user as admin
    const { userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the user as admin
    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: 'User set as admin successfully' });
  } catch (error) {
    console.error('Error setting user as admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
