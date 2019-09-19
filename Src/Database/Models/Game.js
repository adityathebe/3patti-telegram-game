const mongoose = require('mongoose');

let gameSchema = mongoose.Schema({
  createdAt: { type: Date, default: () => Date.now() },
  groupId: { type: String, required: true },
  authorId: { type: String, required: true },
  playersCount: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  initialParticipants: [{ type: String }],
});

module.exports = mongoose.model('Game', gameSchema);
