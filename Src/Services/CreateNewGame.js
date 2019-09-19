// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/createGame$/, async (msg, match) => {
  // Check if user is already registtered
  const doc = await UserDB.findUser(msg.from.id.toString());
  if (doc === null) {
    return bot.sendMessage(msg.chat.id, 'Please register first. Send /register in private message', {
      reply_to_message_id: msg.message_id,
    });
  }

  const author = msg.from.id;
  const groupId = msg.chat.id;
});
