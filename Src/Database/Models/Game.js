const mongoose = require('mongoose');

let gameSchema = mongoose.Schema({
  createdAt: { type: Date, default: () => Date.now() },
  groupId: { type: String, required: true },
  authorID: { type: String, required: true },
  code: { type: String, required: true },
  initialParticipants: { type: Array },
  playersCount: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Game', gameSchema);
