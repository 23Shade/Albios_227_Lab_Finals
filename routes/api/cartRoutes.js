const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Add product to cart
router.post('/cart', authMiddleware.validateUser, cartController.addToCart);

// Retrieve cart items
router.get('/cart', authMiddleware.validateUser, cartController.getCartItems);

// Update cart item quantity
router.put('/cart/:itemId', authMiddleware.validateUser, cartController.updateCartItemQuantity);

// Remove product from cart
router.delete('/cart/:itemId', authMiddleware.validateUser, cartController.removeCartItem);

module.exports = router;
