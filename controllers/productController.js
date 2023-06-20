// controllers/productController.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    // Implementation for creating a product
    const { name, description, price } = req.body;

    // Create a new product
    const product = new Product({ name, description, price });
    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Implementation for retrieving all products
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving all products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getActiveProducts = async (req, res) => {
  try {
    // Implementation for retrieving all active products
    const activeProducts = await Product.find({ isActive: true });
    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Error retrieving active products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    // Implementation for retrieving a single product
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error retrieving single product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Implementation for updating a product
    const { productId } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product information
    product.name = name;
    product.description = description;
    product.price = price;
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.archiveProduct = async (req, res) => {
  try {
    // Implementation for archiving a product
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Archive the product
    product.isActive = false;
    await product.save();

    res.status(200).json({ message: 'Product archived successfully', product });
  } catch (error) {
    console.error('Error archiving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
