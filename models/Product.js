const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
  userOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

module.exports = mongoose.model('Product', productSchema);
