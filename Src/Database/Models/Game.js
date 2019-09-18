const mongoose = require('mongoose');

let gameSchema = mongoose.Schema({
  createdAt: { type: Date, default: () => Date.now() },
  groupId: { type: String, required: true },
  code: { type: String, required: true },
  playersCount: { type: Number, required: true },
  initialParticipants: { type: Array, required: true },
  status: { type: String, default: () => 'pending' },
});

module.exports = mongoose.model('Game', gameSchema);
