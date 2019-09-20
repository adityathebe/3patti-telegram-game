// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/wallet|Wallet$/, async msg => {
  if (msg.chat.type !== 'private') return;
  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb === null) {
    return bot.sendMessage(msg.chat.id, 'Please /register first');
  }
  const inlineKeyboardMarkup = {
    inline_keyboard: [
      [
        { text: 'Add Balance', callback_data: 'BALANCE-ADD' },
        { text: 'Withdraw Balance', callback_data: 'BALANCE-WITHDRAW' },
      ],
      [{ text: 'Transfer Balance', callback_data: 'BALANCE-TRANSFER' }],
    ],
  };
  bot.sendMessage(msg.chat.id, 'The buttons below will not function', {
    reply_markup: inlineKeyboardMarkup,
  });
});

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('BALANCE-') !== 0) return;
  const userChosenOption = payload.replace('BALANCE-', '');
  bot.answerCallbackQuery(query.id, { text: userChosenOption, cache_time: 60 });
});
