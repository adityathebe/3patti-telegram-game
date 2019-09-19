const mongoose = require('mongoose');

class Database {
  static connect() {
    return new Promise((resolve, reject) => {
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);
      mongoose.set('useUnifiedTopology', true);
      mongoose.connect(process.env.MONGO_HOST_URI + process.env.MONGO_DB_NAME, { useNewUrlParser: true });
      const db = mongoose.connection;
      db.on('error', reject);
      db.once('open', resolve);
    });
  }
}

module.exports = Database;
