const mongoose = require('mongoose');

const POSSIBLE_MOVES = ['raise', 'pack', 'blind', 'show'];

module.exports = mongoose.model(
  'Move',
  mongoose.Schema({
    amount: { type: Number, required: true },
    gameId: { type: String, required: true },
    roundId: { type: String, required: true },
    participant: { type: String, required: true },
    createdAt: { type: Date, default: () => Date.now() },
    move: { type: String, required: true, enum: POSSIBLE_MOVES },
  })
);
