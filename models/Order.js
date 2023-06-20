const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
