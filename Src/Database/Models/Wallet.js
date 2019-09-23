const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Wallet',
  mongoose.Schema({
    owner: { type: String, required: true, unique: true },
    amount: { type: Number, default: 100 },
  })
);
