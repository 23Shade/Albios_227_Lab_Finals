const User = require('../models/User');
const Product = require('../models/Product');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the user and product exist
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    // Create the cart item
    const cartItem = { productId, quantity };

    // Add the cart item to the user's orderedProducts array
    user.orderedProducts.push(cartItem);
    await user.save();

    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get cart items for a user
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find the user and populate the orderedProducts with product details
    const user = await User.findById(userId).populate('orderedProducts.productId');

    res.status(200).json({ cartItems: user.orderedProducts });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { userId } = req.user;

    // Find the user and the cart item
    const user = await User.findById(userId);
    const cartItem = user.orderedProducts.id(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Cart item quantity updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove cart item
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    // Find the user and remove the cart item
    const user = await User.findById(userId);
    const cartItem = user.orderedProducts.id(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Remove the cart item
    cartItem.remove();
    await user.save();

    res.status(200).json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
