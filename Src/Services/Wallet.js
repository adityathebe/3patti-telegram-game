// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/wallet|Wallet$/, async msg => {
  if (msg.chat.type !== 'private') return;
  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb === null) {
    return bot.sendMessage(msg.chat.id, 'Please /register first');
  }
  const replyKeyboardMarkup = {
    keyboard: [[{ text: 'Add Balance' }], [{ text: 'Withdraw Balance' }], [{ text: 'Transfer Balance' }]],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
  bot.sendMessage(msg.chat.id, 'The buttons below will not function', {
    reply_markup: replyKeyboardMarkup,
  });
});
