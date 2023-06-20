const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/api/userRoutes');

const PORT = 3000;
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
