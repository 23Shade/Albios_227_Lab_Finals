const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  orderedProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
