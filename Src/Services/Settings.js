// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/settings$/, async msg => {
  if (msg.chat.type !== 'private') return;
  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb === null) {
    return bot.sendMessage(msg.chat.id, 'Please /register first');
  }
  let response = '';
  const replyKeyboardMarkup = {
    keyboard: [[{ text: 'Profile' }, { text: 'Wallet' }]],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
  bot.sendMessage(msg.chat.id, 'Settings ...', {
    reply_markup: replyKeyboardMarkup,
  });
});

bot.onText(/Profile$/, async msg => {
  if (msg.chat.type !== 'private') return;

  const userInDb = await UserDB.findUser(msg.from.id.toString());
  let response = '';
  response += `Username : ${userInDb.username}\n`;
  response += `Contact : ${userInDb.phoneNumber}\n`;
  response += `Registered on : ${new Date(userInDb.registered).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    weekday: 'long',
    day: '2-digit',
  })}`;
  bot.sendMessage(msg.chat.id, response);
});
