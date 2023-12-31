require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Middleware
app.use(express.json());

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

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

// Define the User model
const User = mongoose.model('User', {
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  orderedProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      orderId: { type: String },
    },
  ],
});

// Define the Product model
const Product = mongoose.model('Product', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  price: Number,
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
});

// Define the Order model
const Order = mongoose.model('Order', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      name: String,
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: Number,
  purchasedOn: { type: Date, default: Date.now },
});

// User Registration
app.post('/register', (req, res) => {
  const { email, password, isAdmin } = req.body;

  // Create a new user object
  const user = new User({
    email,
    password,
    isAdmin,
  });

  // Save the user to the database
  user.save()
    .then((result) => {
      res.json({ message: 'User registered successfully', user: result });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to register user' });
    });
});

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email and password
  User.findOne({ email, password })
    .then((user) => {
      if (user) {
        res.json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Login failed' });
    });
});

// Create a new product (for Admin only)
app.post('/products', (req, res) => {
  const userId = req.headers['user-id'];

  // Check if the user is an admin
  User.findById(userId)
    .then((user) => {
      if (user && user.isAdmin) {
        const { name, description, price } = req.body;

        // Create a new product object
        const product = new Product({
          userId,
          name,
          description,
          price,
        });

        // Save the product to the database
        product.save()
          .then((result) => {
            res.json({ message: 'Product created successfully', product: result });
          })
          .catch((error) => {
            res.status(500).json({ error: 'Failed to create product' });
          });
      } else {
        res.status(401).json({ error: 'Unauthorized access' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});


// Get all active products
app.get('/products', (req, res) => {
  // Find all active products
  Product.find({ isActive: true })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve products' });
    });
});

// Get a product by productId
app.get('/products/:productId', (req, res) => {
  const { productId } = req.params;

  // Find the product by productId
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve product' });
    });
});

// Get all orders (for Admin only)
app.get('/users/orders', (req, res) => {
  const userId = req.headers['user-id'];

  // Check if the user is an admin
  User.findById(userId)
    .then((user) => {
      if (user && user.isAdmin) {
        // Find all orders
        Order.find()
          .then((orders) => {
            res.json(orders);
          })
          .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve orders' });
          });
      } else {
        res.status(401).json({ error: 'Unauthorized access' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// Get user orders
app.get('/users/orders', (req, res) => {
  const userId = req.headers['user-id'];

  // Find user orders by userId
  Order.find({ userId })
    .then((orders) => {
      res.json(orders);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user orders' });
    });
});

// Place a new order
app.post('/orders', (req, res) => {
  const { userId, products, totalAmount } = req.body;

  // Create a new order object
  const order = new Order({
    userId,
    products,
    totalAmount,
  });

  // Save the order to the database
  order.save()
    .then((result) => {
      res.json({ message: 'Order placed successfully', order: result });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to place order' });
    });
});

// Delete a product (for Admin only)
app.delete('/products/:productId', (req, res) => {
  const { productId } = req.params;

  // Check if the user is an admin
  User.findById(req.headers['user-id'])
    .then((user) => {
      if (user && user.isAdmin) {
        // Find the product by productId and delete it
        Product.findByIdAndDelete(productId)
          .then((product) => {
            if (product) {
              res.json({ message: 'Product deleted successfully' });
            } else {
              res.status(404).json({ error: 'Product not found' });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: 'Failed to delete product' });
          });
      } else {
        res.status(401).json({ error: 'Unauthorized access' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// Update user password
app.put('/users/password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  // Find the user by email and current password
  User.findOne({ email, password: currentPassword })
    .then((user) => {
      if (user) {
        // Update the user's password
        user.password = newPassword;
        user.save()
          .then((result) => {
            res.json({ message: 'Password updated successfully' });
          })
          .catch((error) => {
            res.status(500).json({ error: 'Failed to update password' });
          });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve user' });
    });
});

// Update a product (for Admin only)
app.put('/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { name, description, price } = req.body;
  
    // Check if the user is an admin
    User.findById(req.headers['user-id'])
      .then((user) => {
        if (user && user.isAdmin) {
          // Find the product by productId and update its details
          Product.findByIdAndUpdate(productId, { name, description, price }, { new: true })
            .then((product) => {
              if (product) {
                res.json({ message: 'Product updated successfully', product });
              } else {
                res.status(404).json({ error: 'Product not found' });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to update product' });
            });
        } else {
          res.status(401).json({ error: 'Unauthorized access' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
  });

// Archive (soft delete) or restore a product (admin only)
app.put('/products/archive/:productId', (req, res) => {
    const { productId } = req.params;
    const userId = req.headers['user-id'];
  
    // Check if the user is an admin
    User.findById(userId)
      .then((user) => {
        if (user && user.isAdmin) {
          // Find the product by productId
          Product.findById(productId)
            .then((product) => {
              if (product) {
                // Toggle the isActive field
                product.isActive = !product.isActive;
                return product.save();
              } else {
                throw new Error('Product not found');
              }
            })
            .then((updatedProduct) => {
              const message = updatedProduct.isActive ? 'Product restored successfully' : 'Product archived successfully';
              res.json({ message, product: updatedProduct });
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to update product status' });
            });
        } else {
          res.status(401).json({ error: 'Unauthorized access' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
  });  
  
  
// Delete an order
app.delete('/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
  
    // Find the order by orderId and delete it
    Order.findByIdAndDelete(orderId)
      .then((order) => {
        if (order) {
          res.json({ message: 'Order deleted successfully' });
        } else {
          res.status(404).json({ error: 'Order not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to delete order' });
      });
  });
  
  // Update user password
  app.put('/users/password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
  
    // Find the user by email and current password
    User.findOne({ email, password: currentPassword })
      .then((user) => {
        if (user) {
          // Update the user's password
          user.password = newPassword;
          user.save()
            .then((result) => {
              res.json({ message: 'Password updated successfully' });
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to update password' });
            });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to retrieve user' });
      });
  });  
  
// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Invalid route' });
  });