const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Round',
  mongoose.Schema({
    gameId: { type: String, required: true },
    createdAt: { type: Date, default: () => Date.now() },
    participants: [{ type: String }],
    potAmount: { type: Number, required: true },
    cardHands: [{ type: String }], // Store cardHands as string
  })
);
