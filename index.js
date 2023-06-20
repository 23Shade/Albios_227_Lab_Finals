// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/api/userRoutes');
const productRoutes = require('./routes/api/productRoutes');
const orderRoutes = require('./routes/api/orderRoutes');
const cartRoutes = require('./routes/api/cartRoutes'); // Import cart routes

const PORT = 3000;
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes); // Mount cart routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
