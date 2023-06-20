// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    // Implementation for creating an order
    // Assuming the authenticated user's ID is available in req.user

    // Retrieve the user's ID from the authentication token
    const userId = req.user.id;

    // Create a new order
    const order = new Order({ userId, products: req.body.products });
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // Implementation for retrieving all orders
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    // Implementation for retrieving authenticated user's orders
    // Assuming the authenticated user's ID is available in req.user

    // Retrieve the user's ID from the authentication token
    const userId = req.user.id;

    // Retrieve the user's orders
    const userOrders = await Order.find({ userId });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
