const express = require('express');
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Middleware
app.use(express.json());

// MongoDB Atlas connection string
const uri = 'mongodb+srv://admin:admin123@dlsud-sandbox.6ccxmzi.mongodb.net/e-commerce?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start the server after successful database connection
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
