// @ts-check
const bot = require('../bot');

bot.onText(/\/wallet|Wallet$/, (msg, match) => {
  if (msg.chat.type !== 'private') return;
  const replyKeyboardMarkup = {
    keyboard: [[{ text: 'Add Balance' }], [{ text: 'Withdraw Balance' }], [{ text: 'Transfer Balance' }]],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
  bot.sendMessage(msg.chat.id, 'The buttons below will not function', {
    reply_markup: replyKeyboardMarkup,
  });
});


