const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  registered: { type: Date, default: () => Date.now() },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
